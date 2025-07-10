import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import galleryRoutes from './routes/galleryRoutes';
import artworkRoutes from './routes/artworkRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/galleries', galleryRoutes);
app.use('/api/artworks', artworkRoutes);

// Database relationships
import User from './models/User';
import Gallery from './models/Gallery';
import Artwork from './models/Artwork';

// Set up associations
User.hasMany(Gallery, { foreignKey: 'userId', as: 'galleries' });
Gallery.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Gallery.hasMany(Artwork, { foreignKey: 'galleryId', as: 'artworks' });
Artwork.belongsTo(Gallery, { foreignKey: 'galleryId', as: 'gallery' });

User.hasMany(Artwork, { foreignKey: 'userId', as: 'artworks' });
Artwork.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Sync database
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');
}).catch((error) => {
  console.error('Database sync error:', error);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
