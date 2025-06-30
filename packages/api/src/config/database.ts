import { Sequelize } from 'sequelize';

// Explicitly require pg to ensure it's available for Sequelize in serverless environment
require('pg');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required but not set');
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false,
  },
  logging: false,
});

export default sequelize;
