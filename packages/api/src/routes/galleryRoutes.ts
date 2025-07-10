import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import Gallery from '../models/Gallery';
import Artwork from '../models/Artwork';
import User from '../models/User';

const router = express.Router();

// Get all public galleries (for discovery)
router.get('/public', async (req: Request, res: Response) => {
  try {
    const galleries = await Gallery.findAll({
      where: { isPublic: true },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'displayName'],
        },
        {
          model: Artwork,
          as: 'artworks',
          limit: 3, // Show first 3 items as preview
        },
      ],
      order: [['visitCount', 'DESC']],
      limit: 20,
    });

    res.json(galleries);
  } catch (error) {
    console.error('Error fetching public galleries:', error);
    res.status(500).json({ error: 'Failed to fetch galleries' });
  }
});

// Get user's galleries
router.get('/my-galleries', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const galleries = await Gallery.findAll({
      where: { userId },
      include: [
        {
          model: Artwork,
          as: 'artworks',
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(galleries);
  } catch (error) {
    console.error('Error fetching user galleries:', error);
    res.status(500).json({ error: 'Failed to fetch galleries' });
  }
});

// Get specific gallery with all items
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const galleryId = parseInt(req.params.id);
    const gallery = await Gallery.findByPk(galleryId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'displayName', 'bio'],
        },
        {
          model: Artwork,
          as: 'artworks',
          order: [['createdAt', 'ASC']],
        },
      ],
    });

    if (!gallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }

    // Increment visit count for public galleries
    if (gallery.isPublic) {
      await gallery.increment('visitCount');
    }

    res.json(gallery);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

// Create new gallery
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { title, description, roomType, theme, isPublic } = req.body;

    const gallery = await Gallery.create({
      userId,
      title,
      description,
      roomType,
      theme: theme || 'brutalist',
      isPublic: isPublic !== false, // Default to true
    });

    res.status(201).json(gallery);
  } catch (error) {
    console.error('Error creating gallery:', error);
    res.status(500).json({ error: 'Failed to create gallery' });
  }
});

// Update gallery
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const galleryId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const gallery = await Gallery.findOne({
      where: { id: galleryId, userId },
    });

    if (!gallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }

    const { title, description, roomType, theme, isPublic } = req.body;

    await gallery.update({
      title,
      description,
      roomType,
      theme,
      isPublic,
    });

    res.json(gallery);
  } catch (error) {
    console.error('Error updating gallery:', error);
    res.status(500).json({ error: 'Failed to update gallery' });
  }
});

// Delete gallery
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const galleryId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const gallery = await Gallery.findOne({
      where: { id: galleryId, userId },
    });

    if (!gallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }

    // Delete associated artworks first
    await Artwork.destroy({
      where: { galleryId },
    });

    await gallery.destroy();

    res.json({ message: 'Gallery deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery:', error);
    res.status(500).json({ error: 'Failed to delete gallery' });
  }
});

// Add artwork to gallery
router.post('/:id/artworks', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const galleryId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const gallery = await Gallery.findOne({
      where: { id: galleryId, userId },
    });

    if (!gallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }

    const { title, description, category, imageUrl, metadata, position, rotation } = req.body;

    const artwork = await Artwork.create({
      userId,
      galleryId,
      title,
      description,
      category,
      imageUrl,
      metadata,
      position: position || { x: 0, y: 0, z: 0 },
      rotation: rotation || { x: 0, y: 0, z: 0 },
    });

    res.status(201).json(artwork);
  } catch (error) {
    console.error('Error adding artwork:', error);
    res.status(500).json({ error: 'Failed to add artwork' });
  }
});

// Update artwork
router.put('/artworks/:artworkId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const artworkId = req.params.artworkId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const artwork = await Artwork.findOne({
      where: { id: artworkId, userId },
    });

    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    const { title, description, category, imageUrl, metadata, position, rotation } = req.body;

    await artwork.update({
      title,
      description,
      category,
      imageUrl,
      metadata,
      position,
      rotation,
    });

    res.json(artwork);
  } catch (error) {
    console.error('Error updating artwork:', error);
    res.status(500).json({ error: 'Failed to update artwork' });
  }
});

// Delete artwork
router.delete('/artworks/:artworkId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const artworkId = req.params.artworkId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const artwork = await Artwork.findOne({
      where: { id: artworkId, userId },
    });

    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    await artwork.destroy();

    res.json({ message: 'Artwork deleted successfully' });
  } catch (error) {
    console.error('Error deleting artwork:', error);
    res.status(500).json({ error: 'Failed to delete artwork' });
  }
});

export default router;
