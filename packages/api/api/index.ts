import { VercelRequest, VercelResponse } from '@vercel/node';

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    console.log('Serverless function called:', req.method, req.url);
    console.log('Headers:', req.headers);
    
    // Add a simple test endpoint
    if (req.url === '/test') {
      return res.json({ message: 'Serverless function is working!', url: req.url, method: req.method });
    }
    
    // Import the app here to catch any import errors
    const app = await import('../src/index');
    console.log('App imported successfully');
    
    return app.default(req, res);
  } catch (error: any) {
    console.error('Serverless function error:', error);
    console.error('Error stack:', error?.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error?.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    });
  }
}; 