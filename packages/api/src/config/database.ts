import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.NODE_ENV === 'test' || process.env.VERCEL ? ':memory:' : './database.sqlite',
  logging: false,
});

export default sequelize;
