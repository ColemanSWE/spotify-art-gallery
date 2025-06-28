import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database';
import userRoutes from './routes/userRoutes';
import galleryRoutes from './routes/galleryRoutes';
import artworkRoutes from './routes/artworkRoutes';
import { errorHandler } from './middleware/error';
import cors from 'cors';
import { Server } from 'http';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(cors());

app.use(express.json());

let server: Server;

const startServer = async (port: number = PORT): Promise<Server> => {
  await sequelize.sync();
  server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  return server;
};

const stopServer = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (server) {
      server.close((err) => {
        if (err) return reject(err);
        console.log('Server closed');
        resolve();
      });
    } else {
      resolve();
    }
  });
};

app.use('/api/users', userRoutes);
app.use('/api/artworks', artworkRoutes);
app.use('/api/galleries', galleryRoutes);

app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Virtual Art Gallery API');
});

if (process.env.NODE_ENV !== 'test') {
  startServer().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

export { app, startServer, stopServer };
