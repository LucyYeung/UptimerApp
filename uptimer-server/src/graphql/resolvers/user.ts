import { INotificationDocument } from '@app/interfaces/notification.interface';
import { IUserDocument } from '@app/interfaces/user.interface';
import { JWT_TOKEN } from '@app/server/config';
import { AppContext } from '@app/server/server';
import {
  createNotificationGroup,
  getAllNotificationGroup,
} from '@app/services/notification.service';
import {
  createNewUser,
  getUserByUserNameOrEmail,
} from '@app/services/user.service';
import { Request } from 'express';
import { GraphQLError } from 'graphql';
import { sign } from 'jsonwebtoken';
import { toLower, upperFirst } from 'lodash';

export const UserResolver = {
  Mutation: {
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
  },
};

const userReturnValue = async (
  req: Request,
  result: IUserDocument,
  type: string,
) => {
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

  const { id, email, username } = result;
  const userJwt: string = sign({ id, email, username }, JWT_TOKEN);
  req.session = {
    jwt: userJwt,
    enableAutomaticRefresh: false,
  };

  const user = {
    id,
    email,
    username,
  } as IUserDocument;
  return { user, notifications };
};
