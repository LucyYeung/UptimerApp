import { IAuthPayload } from '@app/interfaces/user.interface';
import { JWT_TOKEN } from '@app/server/config';
import { Request } from 'express';
import { GraphQLError } from 'graphql';
import { verify } from 'jsonwebtoken';

/**
 * Checks if email is valid
 * @param email email address
 * @return {boolean}
 */
export const isEmail = (email: string): boolean => {
  const regexExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
  return regexExp.test(email);
};

/**
 * Authenticates user access to protected routes
 * @param req express request
 * @return {void}
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
