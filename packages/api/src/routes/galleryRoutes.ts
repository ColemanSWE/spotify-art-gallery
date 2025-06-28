import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import Gallery from '../models/Gallery';

const router = Router();

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const gallery = await Gallery.create({
      name,
      description,
      createdBy: req.user?.id,
    });
    res.status(201).json({ message: 'Gallery created successfully', gallery });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create gallery', error });
  }
});

export default router;
