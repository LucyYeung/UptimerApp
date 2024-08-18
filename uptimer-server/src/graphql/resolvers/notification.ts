import { AppContext } from '@app/interfaces/monitor.interface';
import { INotificationDocument } from '@app/interfaces/notification.interface';
import {
  createNotificationGroup,
  deleteNotificationGroup,
  getAllNotificationGroups,
  updateNotificationGroup,
} from '@app/services/notification.service';
import { authenticateGraphQLRoute } from '@app/utils/utils';

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
        throw new Error(error);
      }
    },
  },
  Mutation: {
    createNotificationGroup: async (
      _: undefined,
      args: { group: INotificationDocument },
      contextValue: AppContext,
    ) => {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);

      const notification = await createNotificationGroup(args.group);
      return {
        notifications: [notification],
      };
    },
    updateNotificationGroup: async (
      _: undefined,
      args: { notificationId: string; group: INotificationDocument },
      contextValue: AppContext,
    ) => {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);

      const { notificationId, group } = args;
      await updateNotificationGroup(parseInt(notificationId), group);
      const notification = { ...group, id: parseInt(notificationId) };
      return {
        notifications: [notification],
      };
    },
    deleteNotificationGroup: async (
      _: undefined,
      { notificationId }: { notificationId: string },
      contextValue: AppContext,
    ) => {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);

      await deleteNotificationGroup(parseInt(notificationId));
      return {
        id: notificationId,
      };
    },
  },
};
