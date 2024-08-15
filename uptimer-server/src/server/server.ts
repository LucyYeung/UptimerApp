import { Express, NextFunction, Request, Response } from 'express';
import http from 'http';
import { PORT } from './config';

export default class MonitorServer {
  private app: Express;
  private httpServer: http.Server;

  constructor(app: Express) {
    this.app = app;
    this.httpServer = new http.Server(app);
  }

  async start() {
    this.standardMiddleware(this.app);
    this.startServer();
  }

  private standardMiddleware(app: Express) {
    app.set('trust proxy', true);
    app.use((_req: Request, res: Response, next: NextFunction) => {
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      next();
    });
  }

  private async startServer() {
    try {
      const SERVER_PORT: number = parseInt(PORT!, 10) || 5000;
      console.info(`Server has started with process id: ${process.pid}`);
      this.httpServer.listen(SERVER_PORT, () => {
        console.info(`Server running on port: ${SERVER_PORT}`);
      });
    } catch (error) {
      console.error('error', 'startServer() error methods:', error);
    }
  }
}
