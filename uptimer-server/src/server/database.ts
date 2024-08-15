import { Sequelize } from 'sequelize';

import { POSTGRES_DB } from './config';
import logger from './logger';

export const sequelize: Sequelize = new Sequelize(POSTGRES_DB, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    multipleStatements: true,
  },
});

export const databaseConnection = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
  }
};
