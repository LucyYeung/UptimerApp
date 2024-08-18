import { ApolloServer } from '@apollo/server';
import { BaseContext } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { resolvers } from '@app/graphql/resolvers';
import { mergedGQLSchema } from '@app/graphql/schema';
import { AppContext } from '@app/interfaces/monitor.interface';
import { makeExecutableSchema } from '@graphql-tools/schema';
import cookieSession from 'cookie-session';
import cors from 'cors';
import dayjs from 'dayjs';
import customFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import {
  Express,
  NextFunction,
  Request,
  Response,
  json,
  urlencoded,
} from 'express';
import http from 'http';

import {
  CLIENT_URL,
  NODE_ENV,
  PORT,
  SECRET_KEY_ONE,
  SECRET_KEY_TWO,
} from './config';
import logger from './logger';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customFormat);

export default class MonitorServer {
  private app: Express;
  private httpServer: http.Server;
  private server: ApolloServer;

  constructor(app: Express) {
    this.app = app;
    this.httpServer = new http.Server(app);
    const schema = makeExecutableSchema({
      typeDefs: mergedGQLSchema,
      resolvers,
    });
    this.server = new ApolloServer<AppContext | BaseContext>({
      schema,
      introspection: NODE_ENV !== 'production',
      plugins: [
        ApolloServerPluginDrainHttpServer({
          httpServer: this.httpServer,
        }),
        NODE_ENV === 'production'
          ? ApolloServerPluginLandingPageDisabled()
          : ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      ],
    });
  }

  async start() {
    /**
     * Note that you must call the start() method on the ApolloServer
     * instance before passing it to the express middleware.
     */
    await this.server.start();
    this.standardMiddleware(this.app);
    this.startServer();
  }

  private standardMiddleware(app: Express) {
    app.set('trust proxy', true);
    app.use((_req: Request, res: Response, next: NextFunction) => {
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      next();
    });
    app.use(
      cookieSession({
        name: 'session',
        keys: [SECRET_KEY_ONE, SECRET_KEY_TWO],
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: NODE_ENV !== 'development',
        ...(NODE_ENV !== 'development' && { sameSite: 'none' }),
      }),
    );
    this.graphqlRoute(app);
    this.healthRoute(app);
  }

  private graphqlRoute(app: Express) {
    app.use(
      '/graphql',
      cors({
        origin: CLIENT_URL,
        credentials: true,
      }),
      json({ limit: '200mb' }),
      urlencoded({ extended: true, limit: '200mb' }),
      expressMiddleware(this.server, {
        context: async ({ req, res }) => ({ req, res }),
      }),
    );
  }

  private healthRoute(app: Express) {
    app.get('/health', (_req: Request, res: Response) => {
      res.status(200).send('Uptimer monitor server is healthy and OK.');
    });
  }

  private async startServer() {
    try {
      const SERVER_PORT: number = parseInt(PORT!, 10) || 5000;
      logger.info(`Server has started with process id: ${process.pid}`);
      this.httpServer.listen(SERVER_PORT, () => {
        logger.info(`Server running on port: ${SERVER_PORT}`);
      });
    } catch (error) {
      logger.info('error', 'startServer() error methods:', error);
    }
  }
}
