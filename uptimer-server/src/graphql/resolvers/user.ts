import { INotificationDocument } from '@app/interfaces/notification.interface';
import { IUserDocument, IUserResponse } from '@app/interfaces/user.interface';
import { UserModel } from '@app/models/user.model';
import { JWT_TOKEN } from '@app/server/config';
import { AppContext } from '@app/server/server';
import {
  createNotificationGroup,
  getAllNotificationGroup,
} from '@app/services/notification.service';
import {
  createNewUser,
  getUserByProp,
  getUserBySocialId,
  getUserByUserNameOrEmail,
} from '@app/services/user.service';
import { isEmail } from '@app/utils/utils';
import { Request } from 'express';
import { GraphQLError } from 'graphql';
import { sign } from 'jsonwebtoken';
import { toLower, upperFirst } from 'lodash';

export const UserResolver = {
  Mutation: {
    loginUser: async (
      _: undefined,
      args: { username: string; password: string },
      contextValue: AppContext,
    ) => {
      const { req } = contextValue;
      // TODO: validate

      const { username, password } = args;
      const isValidEmail = isEmail(username);
      const type = !isValidEmail ? 'username' : 'email';
      const existingUser = await getUserByProp(username, type);

      if (!existingUser) {
        throw new GraphQLError('Invalid credentials');
      }

      const passwordMatch = await UserModel.prototype.comparePassword(
        password,
        existingUser.password!,
      );
      if (!passwordMatch) {
        throw new GraphQLError('Invalid credentials');
      }

      const response = await userReturnValue(req, existingUser, 'login');
      return response;
    },
    registerUser: async (
      _: undefined,
      args: { user: IUserDocument },
      contextValue: AppContext,
    ) => {
      const { req } = contextValue;
      const { user } = args;
      // TODO: Add data validation

      const { username, email, password } = user;
      const checkIfUserExist = await getUserByUserNameOrEmail(
        username!,
        email!,
      );
      if (checkIfUserExist) {
        throw new GraphQLError(
          'Invalid credentials. Email or username already exists',
        );
      }

      const authData = {
        username: upperFirst(username),
        email: toLower(email),
        password,
      } as IUserDocument;
      const result = await createNewUser(authData);
      const response = await userReturnValue(req, result, 'register');
      return response;
    },
    authSocialUser: async (
      _: undefined,
      args: { user: IUserDocument },
      contextValue: AppContext,
    ) => {
      const { req } = contextValue;
      const { user } = args;
      // TODO: Add data validation

      const { username, email, socialId, type } = user;
      const checkIfUserExist = await getUserBySocialId(
        socialId!,
        email!,
        type!,
      );
      if (checkIfUserExist) {
        const response = await userReturnValue(req, checkIfUserExist, 'login');
        return response;
      }

      const authData = {
        username: upperFirst(username),
        email: toLower(email),
        ...(type === 'facebook' && { facebookId: socialId }),
        ...(type === 'google' && { googleId: socialId }),
      } as IUserDocument;
      const result = await createNewUser(authData);
      const response = await userReturnValue(req, result, 'register');
      return response;
    },
    logout: async (
      _: undefined,
      __: { user: IUserDocument },
      contextValue: AppContext,
    ) => {
      const { req } = contextValue;
      req.session = null;
      req.currentUser = undefined;
      return null;
    },
  },
  User: {
    createdAt: (user: IUserDocument) => user.createdAt?.toISOString(),
  },
};

const userReturnValue = async (
  req: Request,
  result: IUserDocument,
  type: string,
): Promise<IUserResponse> => {
  let notifications: INotificationDocument[] = [];
  if (type === 'register' && result && result.id && result.email) {
    const notification = await createNotificationGroup({
      userId: result.id,
      groupName: 'Default Contact Group',
      emails: JSON.stringify([result.email]),
    });
    notifications.push(notification);
  } else if (type === 'login' && result && result.id && result.email) {
    notifications = await getAllNotificationGroup(result.id);
  }

  const { id, email, username, createdAt } = result;
  const userJwt: string = sign({ id, email, username }, JWT_TOKEN);
  req.session = {
    jwt: userJwt,
    enableAutomaticRefresh: false,
  };

  const user = {
    id,
    email,
    username,
    createdAt,
  } as IUserDocument;
  return { user, notifications };
};
