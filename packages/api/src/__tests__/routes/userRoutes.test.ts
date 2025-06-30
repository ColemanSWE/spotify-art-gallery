import request from 'supertest';
import sequelize from '../../config/database';
import app from '../../index';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Load environment variables
require('dotenv').config();

let token: string;

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

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }

  token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  console.log('Test setup complete');
});

afterAll(async () => {
  console.log('Closing database connection...');
  await sequelize.close();
  console.log('Database connection closed');
});

describe('User Routes', () => {
  it('should register a new user', async () => {
    console.log('Registering a new user...');
    const response = await request(app)
      .post('/api/users/register')
      .send({
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
    console.log('User registered');
  });

  it('should login a user', async () => {
    console.log('Logging in user...');
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    console.log('User logged in');
  });

  it('should not login a user with incorrect password', async () => {
    console.log('Attempting to login with incorrect password...');
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'testuser@example.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(400); // Check the actual status code returned by your API
    expect(response.body.message).toBe('Invalid email or password');
    console.log('Login failed as expected with incorrect password');
  });

  it('should not login a non-existent user', async () => {
    console.log('Attempting to login with non-existent user...');
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(400); // Check the actual status code returned by your API
    expect(response.body.message).toBe('Invalid email or password');
    console.log('Login failed as expected with non-existent user');
  });
});
