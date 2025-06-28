import { Router, Request, Response } from 'express';
import multer from 'multer';
import Artwork from '../models/Artwork';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post(
  '/upload',
  authMiddleware,
  upload.single('image'),
  async (req: Request, res: Response) => {
    try {
      const { title, description } = req.body;
      if (!req.file) {
        return res.status(400).send('Image file is required');
      }
      const imageUrl = req.file.path;
      const artwork = await Artwork.create({
        title,
        description,
        imageUrl,
        createdBy: req.user?.id || 0,
      });
      res.status(201).send('Artwork uploaded successfully');
    } catch (error) {
      res.status(400).send('Failed to upload artwork');
    }
  },
);

router.get('/', async (req: Request, res: Response) => {
  try {
    const artworks = await Artwork.findAll();
    res.status(200).json(artworks);
  } catch (error) {
    res.status(400).send('Failed to fetch artworks');
  }
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const artwork = await Artwork.findOne({
      where: { id, createdBy: req.user?.id || 0 },
    });
    if (!artwork) return res.status(404).send('Artwork not found');
    await artwork.destroy();
    res.status(200).send('Artwork deleted successfully');
  } catch (error) {
    res.status(400).send('Failed to delete artwork');
  }
});

export default router;
