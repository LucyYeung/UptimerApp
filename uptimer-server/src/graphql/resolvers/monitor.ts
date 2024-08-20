import {
  AppContext,
  IMonitorArgs,
  IMonitorDocument,
} from '@app/interfaces/monitor.interface';
import {
  createMonitor,
  deleteSingleMonitor,
  getHeartBeats,
  getMonitorById,
  getUserActiveMonitors,
  getUserMonitors,
  startCreateMonitor,
  toggleMonitor,
  updateSingleMonitor,
} from '@app/services/monitor.service';
import { getSingleNotificationGroup } from '@app/services/notification.service';
import { startSingleJob, stopSingleBackgroundJob } from '@app/utils/jobs';
import {
  appTimeZone,
  authenticateGraphQLRoute,
  resumeMonitor,
} from '@app/utils/utils';
import { PubSub } from 'graphql-subscriptions';
import { toLower } from 'lodash';

export const pubSub = new PubSub();

export const MonitorResolver = {
  Query: {
    getSingleMonitor: async (
      _: undefined,
      { monitorId }: { monitorId: string },
      contextValue: AppContext,
    ) => {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);

      const monitor = await getMonitorById(parseInt(monitorId!));
      return {
        monitors: [monitor],
      };
    },
    getUserMonitors: async (
      _: undefined,
      { userId }: { userId: string },
      contextValue: AppContext,
    ) => {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);

      const monitors = await getUserMonitors(parseInt(userId!));
      return {
        monitors,
      };
    },
    autoRefresh: async (
      _: undefined,
      { userId, refresh }: { userId: string; refresh: boolean },
      contextValue: AppContext,
    ) => {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);

      req.session = {
        ...req.session,
        enableAutomaticRefresh: refresh,
      };

      if (refresh) {
        startSingleJob(
          `${toLower(req.currentUser?.username)}`,
          appTimeZone,
          10,
          async () => {
            const monitors = await getUserActiveMonitors(parseInt(userId!));
            pubSub.publish('MONITORS_UPDATED', {
              monitorsUpdated: {
                userId: parseInt(userId!),
                monitors,
              },
            });
          },
        );
      } else {
        stopSingleBackgroundJob(`${toLower(req.currentUser?.username)}`);
      }

      return {
        refresh,
      };
    },
  },
  Mutation: {
    createMonitor: async (
      _: undefined,
      args: IMonitorArgs,
      contextValue: AppContext,
    ) => {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);

      const { monitor: body } = args;
      const monitor = await createMonitor(body!);
      if (body?.active && monitor.active) {
        startCreateMonitor(monitor, toLower(body.name), body.type);
      }

      return {
        monitors: [monitor],
      };
    },
    toggleMonitor: async (
      _: undefined,
      args: IMonitorArgs,
      contextValue: AppContext,
    ) => {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);

      const { monitorId, userId, name, active } = args.monitor!;
      const results = await toggleMonitor(monitorId!, userId, active);

      const hasActiveMonitors = results.some((monitor) => monitor.active);
      // Stop auto refresh if no active monitors for single user
      if (!hasActiveMonitors) {
        req.session = {
          ...req.session,
          enableAutomaticRefresh: false,
        };
        stopSingleBackgroundJob(`${toLower(req.currentUser?.username)}`);
      }

      if (!active) {
        stopSingleBackgroundJob(name, monitorId);
      } else {
        resumeMonitor(monitorId!);
      }

      return {
        monitors: results,
      };
    },
    updateMonitor: async (
      _: undefined,
      args: IMonitorArgs,
      contextValue: AppContext,
    ) => {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);

      const { monitorId, userId, monitor } = args;
      const monitors = await updateSingleMonitor(
        parseInt(monitorId!),
        parseInt(userId!),
        monitor!,
      );
      return {
        monitors,
      };
    },
    deleteMonitor: async (
      _: undefined,
      args: IMonitorArgs,
      contextValue: AppContext,
    ) => {
      const { req } = contextValue;
      authenticateGraphQLRoute(req);

      const { monitorId, userId, type } = args;
      await deleteSingleMonitor(parseInt(monitorId!), parseInt(userId!), type!);
      return {
        id: monitorId,
      };
    },
  },
  MonitorResult: {
    lastChanged: (monitor: IMonitorDocument) =>
      JSON.stringify(monitor.lastChanged),
    responseTime: (monitor: IMonitorDocument) =>
      monitor.responseTime
        ? parseInt(monitor.responseTime)
        : monitor.responseTime,
    notifications: (monitor: IMonitorDocument) =>
      getSingleNotificationGroup(monitor.notificationId!),
    heartbeats: async (monitor: IMonitorDocument) => {
      const heartbeats = await getHeartBeats(monitor.type, monitor.id!, 24);
      return heartbeats.slice(0, 16);
    },
  },
  Subscription: {
    monitorsUpdated: {
      subscribe: () => pubSub.asyncIterator(['MONITORS_UPDATED']),
    },
  },
};
