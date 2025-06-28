import request from 'supertest';
import { app, startServer, stopServer } from '../../index';
import sequelize from '../../config/database';
import User from '../../models/User';
import Artwork from '../../models/Artwork';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

let token: string;
let serverInstance: any;

beforeAll(async () => {
  console.log('Syncing database...');
  await sequelize.sync({ force: true });

  console.log('Creating user...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await User.create({
    username: 'testuser',
    email: 'testuser@example.com',
    password: hashedPassword,
  });

  token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '1h',
  });

  console.log('Creating artwork...');
  await Artwork.create({
    title: 'Test Artwork',
    description: 'This is a test artwork',
    imageUrl: 'http://test.com/test.jpg',
    createdBy: user.id,
  });

  console.log('Starting server...');
  serverInstance = await startServer(0); // 0 lets the OS assign a random available port
  console.log('Server started');
});

afterAll(async () => {
  console.log('Stopping server...');
  await stopServer();
  console.log('Server stopped');
  await sequelize.close();
  console.log('Database connection closed');
});

describe('Artwork Routes', () => {
  it('should upload a new artwork', async () => {
    console.log('Uploading artwork...');
    const response = await request(serverInstance)
      .post('/api/artworks/upload')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Test Artwork 2')
      .field('description', 'This is another test artwork')
      .attach('image', Buffer.from(''), 'test2.jpg');

    expect(response.status).toBe(201);
    expect(response.text).toBe('Artwork uploaded successfully');
    console.log('Artwork uploaded');
  });

  it('should fetch all artworks', async () => {
    console.log('Fetching artworks...');
    const response = await request(serverInstance).get('/api/artworks');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    console.log('Artworks fetched');
  });

  it('should delete an artwork', async () => {
    console.log('Deleting artwork...');
    const artwork = await Artwork.findOne();
    const response = await request(serverInstance)
      .delete(`/api/artworks/${artwork?.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.text).toBe('Artwork deleted successfully');
    console.log('Artwork deleted');
  });
});
