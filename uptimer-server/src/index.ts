import express from 'express';

import { databaseConnection } from './server/database';
import MonitorServer from './server/server';

const initializeApp = () => {
  const app = express();
  const monitorServer = new MonitorServer(app);
  databaseConnection().then(() => monitorServer.start());
};

initializeApp();
