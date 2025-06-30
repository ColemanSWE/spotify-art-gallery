import { Sequelize } from 'sequelize';

let sequelize: Sequelize | null = null;

// Disable database in serverless environment to avoid sqlite3 issues
if (process.env.VERCEL) {
  console.log('Running in Vercel - skipping database initialization');
  sequelize = null;
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.NODE_ENV === 'test' ? ':memory:' : './database.sqlite',
    logging: false,
  });
}

export default sequelize;
