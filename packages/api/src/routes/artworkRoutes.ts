import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import Artwork from '../models/Artwork';

const router = express.Router();

// Get all artworks for a user
router.get('/my-artworks', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const artworks = await Artwork.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    res.json(artworks);
  } catch (error) {
    console.error('Error fetching artworks:', error);
    res.status(500).json({ error: 'Failed to fetch artworks' });
  }
});

// Create new artwork
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { title, description, category, imageUrl, metadata, galleryId, position, rotation } = req.body;

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
    console.error('Error creating artwork:', error);
    res.status(500).json({ error: 'Failed to create artwork' });
  }
});

// Get specific artwork
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const artworkId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const artwork = await Artwork.findOne({
      where: { id: artworkId, userId },
    });

    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    res.json(artwork);
  } catch (error) {
    console.error('Error fetching artwork:', error);
    res.status(500).json({ error: 'Failed to fetch artwork' });
  }
});

// Update artwork
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const artworkId = parseInt(req.params.id);

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
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const artworkId = parseInt(req.params.id);

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
