import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import sequelize from '../config/database';

// Conditionally import User model only if database is available
let User: any = null;
if (sequelize) {
  try {
    User = require('../models/User').default;
  } catch (error) {
    console.error('Failed to import User model:', error);
  }
}

const router = express.Router();

// Generate JWT token for a user ID (for testing purposes)
router.post('/token', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // If no database, create a demo token for demo users
    if (!User) {
      console.log('Database not available - generating demo token for:', userId);
      const token = jwt.sign(
        { userId, demo: true },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '24h' }
      );

      return res.json({ 
        token, 
        user: { 
          id: userId, 
          username: 'Demo User', 
          email: 'demo@example.com' 
        } 
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

export default router; 