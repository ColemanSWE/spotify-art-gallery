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

// Configure CORS to allow frontend domain
const allowedOrigins = [
  'http://localhost:3000', // Local development
  'https://spotify-art-gallery-frontend.vercel.app', // Production frontend
];

// Add frontend URL from environment if it exists
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
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

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
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
