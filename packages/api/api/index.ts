import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/index';

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 