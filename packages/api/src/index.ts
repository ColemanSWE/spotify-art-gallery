import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import sequelize from './config/database';
import userRoutes from './routes/userRoutes';
import galleryRoutes from './routes/galleryRoutes';
import artworkRoutes from './routes/artworkRoutes';
import spotifyRoutes from './routes/spotifyRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middleware/error';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Initialize database
sequelize.sync().catch(err => {
  console.error('Database sync failed:', err);
});

app.use('/api/users', userRoutes);
app.use('/api/artworks', artworkRoutes);
app.use('/api/galleries', galleryRoutes);
app.use('/api/spotify', spotifyRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Virtual Art Gallery API');
});

// For local development
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  const PORT = parseInt(process.env.PORT || '3001', 10);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel
export default app;
