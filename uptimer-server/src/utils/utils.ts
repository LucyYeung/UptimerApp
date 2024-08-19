import { IAuthPayload } from '@app/interfaces/user.interface';
import { JWT_TOKEN } from '@app/server/config';
import {
  getAllUsersActiveMonitors,
  startCreateMonitor,
} from '@app/services/monitor.service';
import { Request } from 'express';
import { GraphQLError } from 'graphql';
import { verify } from 'jsonwebtoken';
import { toLower } from 'lodash';

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
