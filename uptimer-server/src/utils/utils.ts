import { pubSub } from '@app/graphql/resolvers/monitor';
import { IHeartbeat } from '@app/interfaces/heartbeat.interface';
import { IEmailLocals } from '@app/interfaces/notification.interface';
import { ISSLMonitorDocument } from '@app/interfaces/ssl.interface';
import { IAuthPayload } from '@app/interfaces/user.interface';
import { CLIENT_URL, JWT_TOKEN } from '@app/server/config';
import logger from '@app/server/logger';
import {
  getAllUsersActiveMonitors,
  getMonitorById,
  getUserActiveMonitors,
  startCreateMonitor,
} from '@app/services/monitor.service';
import {
  getAllUsersActiveSSLMonitors,
  getSSLMonitorById,
  sslStatusMonitor,
} from '@app/services/ssl.service';
import { Request } from 'express';
import { GraphQLError } from 'graphql';
import { verify } from 'jsonwebtoken';
import { toLower } from 'lodash';

import { sendEmail } from './email';
import { startSingleJob } from './jobs';

export const appTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

/**
 * Checks if email is valid
 * @param email email address
 * @returns {boolean}
 */
export const isEmail = (email: string): boolean => {
  const regexExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
  return regexExp.test(email);
};

/**
 * Authenticates user access to protected routes
 * @param req express request
 * @returns {void}
 */
export const authenticateGraphQLRoute = (req: Request) => {
  if (!req.session?.jwt) {
    throw new Error('Please login again.');
  }
  try {
    const payload = verify(req.session.jwt, JWT_TOKEN);
    req.currentUser = payload as IAuthPayload;
  } catch (error) {
    throw new GraphQLError(error);
  }
};

/**
 * Delays for specified number of milliseconds
 * @param ms milliseconds
 * @returns {Promise<void>}
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Returns random integer between min and max
 * @param min
 * @param max
 * @returns {number}
 */
export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const startMonitors = async () => {
  const list = await getAllUsersActiveMonitors();

  for (const monitor of list) {
    startCreateMonitor(monitor, toLower(monitor.name), monitor.type);
    await sleep(getRandomInt(300, 1000));
  }
};

/**
 * Starts all active ssl monitors
 * @returns {Promise<void>}
 */
export const startSSLMonitors = async (): Promise<void> => {
  const list: ISSLMonitorDocument[] = await getAllUsersActiveSSLMonitors();

  for (const monitor of list) {
    sslStatusMonitor(monitor, toLower(monitor.name));
    await sleep(getRandomInt(300, 1000));
  }
};

export const resumeMonitor = async (monitorId: number) => {
  const monitor = await getMonitorById(monitorId);
  startCreateMonitor(monitor, toLower(monitor.name), monitor.type);
  await sleep(getRandomInt(300, 1000));
};

/**
 * Resumes a single ssl monitor
 * @param monitorId
 * @returns {Promise<void>}
 */
export const resumeSSLMonitors = async (monitorId: number): Promise<void> => {
  const monitor: ISSLMonitorDocument = await getSSLMonitorById(monitorId);
  sslStatusMonitor(monitor, toLower(monitor.name));
  await sleep(getRandomInt(300, 1000));
};

export const enableAutoRefreshJob = (cookies: string) => {
  const result = getCookies(cookies);
  const session = Buffer.from(result['session'], 'base64').toString('ascii');
  const payload = verify(JSON.parse(session).jwt, JWT_TOKEN) as IAuthPayload;
  const enableAutoRefresh = JSON.parse(session).enableAutomaticRefresh;
  if (enableAutoRefresh) {
    startSingleJob(
      `${toLower(payload.username)}`,
      appTimeZone,
      10,
      async () => {
        const monitors = await getUserActiveMonitors(payload.id);
        logger.info('Job is enabled');
        pubSub.publish('MONITORS_UPDATED', {
          monitorsUpdated: {
            userId: payload.id,
            monitors,
          },
        });
      },
    );
  }
};

export const encodeBase64 = (user: string, pass: string): string => {
  return Buffer.from(`${user || ''}:${pass || ''}`).toString('base64');
};

export const uptimePercentage = (heartbeats: IHeartbeat[]): number => {
  if (!heartbeats) return 0;
  const totalHeartbeats = heartbeats.length;
  const downtimeHeatbeats = heartbeats.filter(
    (heartbeat) => heartbeat.status === 1,
  ).length;
  return Math.round(
    ((totalHeartbeats - downtimeHeatbeats) / totalHeartbeats) * 100,
  );
};

export const emailSender = async (
  notificationEmails: string,
  template: string,
  locals: IEmailLocals,
) => {
  const emails = JSON.parse(notificationEmails);

  for (const email of emails) {
    await sendEmail(template, email, locals);
  }
};

export const locals = (): IEmailLocals => {
  return {
    appLink: CLIENT_URL,
    appIcon: 'https://picsum.photos/id/0/200/60',
    appName: '',
  };
};

export const getCookies = (cookie: string): Record<string, string> => {
  const cookies = cookie
    .split(';')
    .map((c) => c.split('='))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  return cookies;
};
