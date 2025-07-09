import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import sequelize from './config/database';
import userRoutes from './routes/userRoutes';
import galleryRoutes from './routes/galleryRoutes';
import artworkRoutes from './routes/artworkRoutes';
import spotifyRoutes from './routes/spotifyRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middleware/error';
import cors from 'cors';

// Import models to ensure they are registered with Sequelize
import './models/User';
import './models/Artwork';
import './models/Gallery';

const app = express();

// Configure CORS to allow frontend domain
const allowedOrigins = [
  'http://localhost:3000',
  'https://spotify-art-gallery-frontend.vercel.app',
  'https://www.3dgallery.online'
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

// Database initialization state
let dbInitialized = false;
let dbInitPromise: Promise<void> | null = null;

// Initialize database - create tables if they don't exist
async function initializeDatabase(): Promise<void> {
  if (dbInitialized) return;
  
  if (dbInitPromise) {
    return dbInitPromise;
  }

  dbInitPromise = (async () => {
    try {
      await sequelize.authenticate();
      
      // Sync models to create tables
      await sequelize.sync({ alter: false, force: false });
      dbInitialized = true;
    } catch (error) {
      console.error('Unable to connect to the database or sync tables:', error);
      dbInitPromise = null;
      throw error;
    }
  })();

  return dbInitPromise;
}

// Middleware to ensure database is initialized before handling requests
async function ensureDbInitialized(req: Request, res: Response, next: NextFunction) {
  try {
    await initializeDatabase();
    next();
  } catch (error) {
    console.error('Database initialization failed:', error);
    res.status(500).json({ error: 'Database initialization failed' });
  }
}

// Use the middleware for all routes
app.use(ensureDbInitialized);

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
