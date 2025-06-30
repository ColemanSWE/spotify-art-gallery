import express, { Request, Response } from 'express';
import spotifyService from '../services/spotifyService';
import { authenticateToken } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

// Simple auth endpoint that works without database
router.get('/auth', async (req: Request, res: Response) => {
  try {
    const state = Math.random().toString(36).substring(7);
    const authUrl = spotifyService.generateAuthUrl(state);
    
    res.json({ 
      authUrl,
      state 
    });
  } catch (error) {
    console.error('Error generating Spotify auth URL:', error);
    res.status(500).json({ error: 'Failed to generate authentication URL' });
  }
});

router.get('/auth/callback', async (req: Request, res: Response) => {
  try {
    const { code, state, error } = req.query;

    if (error) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://127.0.0.1:3000'}/auth/error?error=${error}`);
    }

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://127.0.0.1:3000'}/auth/error?error=missing_code`);
    }

    const tokenResponse = await spotifyService.exchangeCodeForTokens(code as string);
    const spotifyUser = await spotifyService.getCurrentUser(tokenResponse.access_token);

    let user = await User.findOne({ where: { spotifyId: spotifyUser.id } });
    
    if (!user) {
      user = await User.create({
        username: spotifyUser.display_name || spotifyUser.id,
        email: spotifyUser.email,
        spotifyId: spotifyUser.id,
        spotifyAccessToken: tokenResponse.access_token,
        spotifyRefreshToken: tokenResponse.refresh_token,
        spotifyTokenExpiry: new Date(Date.now() + tokenResponse.expires_in * 1000)
      });
    } else {
      await user.update({
        spotifyAccessToken: tokenResponse.access_token,
        spotifyRefreshToken: tokenResponse.refresh_token || user.spotifyRefreshToken,
        spotifyTokenExpiry: new Date(Date.now() + tokenResponse.expires_in * 1000)
      });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:3000';
    res.redirect(`${frontendUrl}/auth/success?userId=${user.id}`);
  } catch (error) {
    console.error('Error in Spotify callback:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:3000';
    res.redirect(`${frontendUrl}/auth/error?error=callback_failed`);
  }
});

router.get('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await User.findByPk(userId);
    if (!user || !user.spotifyAccessToken) {
      return res.status(404).json({ error: 'User not found or Spotify not connected' });
    }

    let accessToken = user.spotifyAccessToken;

    if (user.spotifyTokenExpiry && new Date() > user.spotifyTokenExpiry) {
      if (!user.spotifyRefreshToken) {
        return res.status(401).json({ error: 'Spotify token expired and no refresh token available' });
      }

      try {
        const refreshResponse = await spotifyService.refreshAccessToken(user.spotifyRefreshToken);
        accessToken = refreshResponse.access_token;
        
        await user.update({
          spotifyAccessToken: refreshResponse.access_token,
          spotifyRefreshToken: refreshResponse.refresh_token || user.spotifyRefreshToken,
          spotifyTokenExpiry: new Date(Date.now() + refreshResponse.expires_in * 1000)
        });
      } catch (refreshError) {
        console.error('Error refreshing Spotify token:', refreshError);
        return res.status(401).json({ error: 'Failed to refresh Spotify token' });
      }
    }

    const spotifyProfile = await spotifyService.getCurrentUser(accessToken);
    res.json(spotifyProfile);
  } catch (error) {
    console.error('Error fetching Spotify profile:', error);
    res.status(500).json({ error: 'Failed to fetch Spotify profile' });
  }
});

router.get('/top-albums', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await User.findByPk(userId);
    if (!user || !user.spotifyAccessToken) {
      return res.status(404).json({ error: 'User not found or Spotify not connected' });
    }

    let accessToken = user.spotifyAccessToken;

    if (user.spotifyTokenExpiry && new Date() > user.spotifyTokenExpiry) {
      if (!user.spotifyRefreshToken) {
        return res.status(401).json({ error: 'Spotify token expired and no refresh token available' });
      }

      try {
        const refreshResponse = await spotifyService.refreshAccessToken(user.spotifyRefreshToken);
        accessToken = refreshResponse.access_token;
        
        await user.update({
          spotifyAccessToken: refreshResponse.access_token,
          spotifyRefreshToken: refreshResponse.refresh_token || user.spotifyRefreshToken,
          spotifyTokenExpiry: new Date(Date.now() + refreshResponse.expires_in * 1000)
        });
      } catch (refreshError) {
        console.error('Error refreshing Spotify token:', refreshError);
        return res.status(401).json({ error: 'Failed to refresh Spotify token' });
      }
    }

    const timeRange = req.query.timeRange as 'short_term' | 'medium_term' | 'long_term' || 'medium_term';
    const limit = parseInt(req.query.limit as string) || 20;

    const topAlbums = await spotifyService.getUserTopAlbums(accessToken, timeRange, limit);
    res.json(topAlbums);
  } catch (error) {
    console.error('Error fetching top albums:', error);
    res.status(500).json({ error: 'Failed to fetch top albums' });
  }
});

router.get('/album/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await User.findByPk(userId);
    if (!user || !user.spotifyAccessToken) {
      return res.status(404).json({ error: 'User not found or Spotify not connected' });
    }

    let accessToken = user.spotifyAccessToken;

    if (user.spotifyTokenExpiry && new Date() > user.spotifyTokenExpiry) {
      if (!user.spotifyRefreshToken) {
        return res.status(401).json({ error: 'Spotify token expired and no refresh token available' });
      }

      try {
        const refreshResponse = await spotifyService.refreshAccessToken(user.spotifyRefreshToken);
        accessToken = refreshResponse.access_token;
        
        await user.update({
          spotifyAccessToken: refreshResponse.access_token,
          spotifyRefreshToken: refreshResponse.refresh_token || user.spotifyRefreshToken,
          spotifyTokenExpiry: new Date(Date.now() + refreshResponse.expires_in * 1000)
        });
      } catch (refreshError) {
        console.error('Error refreshing Spotify token:', refreshError);
        return res.status(401).json({ error: 'Failed to refresh Spotify token' });
      }
    }

    const albumId = req.params.id;
    const album = await spotifyService.getAlbumById(accessToken, albumId);
    res.json(album);
  } catch (error) {
    console.error('Error fetching album:', error);
    res.status(500).json({ error: 'Failed to fetch album' });
  }
});

export default router; 