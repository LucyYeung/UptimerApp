import { AppContext } from '@app/server/server';
import { getAllNotificationGroups } from '@app/services/notification.service';
import { authenticateGraphQLRoute } from '@app/utils/utils';
import { GraphQLError } from 'graphql';

export const NotificationResovler = {
  Query: {
    getUserNotificationGroups: async (
      _: undefined,
      { userId }: { userId: string },
      contextValue: AppContext,
    ) => {
      try {
        const { req } = contextValue;
        authenticateGraphQLRoute(req);

        const notifications = await getAllNotificationGroups(parseInt(userId));
        return {
          notifications,
        };
      } catch (error) {
        throw new GraphQLError(error);
      }
    },
  },
};
