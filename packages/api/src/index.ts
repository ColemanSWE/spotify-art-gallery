import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';

console.log('Starting Express app initialization...');

let sequelize: any;
try {
  sequelize = require('./config/database').default;
  console.log('Database imported successfully');
} catch (error) {
  console.error('Failed to import database:', error);
}

let userRoutes: any, galleryRoutes: any, artworkRoutes: any, spotifyRoutes: any, authRoutes: any, errorHandler: any;

try {
  userRoutes = require('./routes/userRoutes').default;
  galleryRoutes = require('./routes/galleryRoutes').default;
  artworkRoutes = require('./routes/artworkRoutes').default;
  spotifyRoutes = require('./routes/spotifyRoutes').default;
  authRoutes = require('./routes/authRoutes').default;
  errorHandler = require('./middleware/error').errorHandler;
  console.log('All routes imported successfully');
} catch (error) {
  console.error('Failed to import routes:', error);
}

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
if (sequelize) {
  sequelize.sync().catch((err: any) => {
    console.error('Database sync failed:', err);
    // Don't crash the app, just log the error
  });
} else {
  console.log('Skipping database sync - sequelize not available');
}

// Register routes only if they were imported successfully
if (userRoutes) app.use('/api/users', userRoutes);
if (artworkRoutes) app.use('/api/artworks', artworkRoutes);
if (galleryRoutes) app.use('/api/galleries', galleryRoutes);
if (spotifyRoutes) app.use('/api/spotify', spotifyRoutes);
if (authRoutes) app.use('/api/auth', authRoutes);

if (errorHandler) app.use(errorHandler);

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
