import {
  AppContext,
  IMonitorArgs,
  IMonitorDocument,
} from '@app/interfaces/monitor.interface';
import logger from '@app/server/logger';
import {
  createMonitor,
  deleteSingleMonitor,
  getMonitorById,
  toggleMonitor,
  updateSingleMonitor,
} from '@app/services/monitor.service';
import { getSingleNotificationGroup } from '@app/services/notification.service';
import { startSingleJob, stopSingleBackgroundJob } from '@app/utils/jobs';
import { appTimeZone, authenticateGraphQLRoute } from '@app/utils/utils';

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
        // TODO: start created monitor
        logger.info('Start new monitor');
        startSingleJob(body.name, appTimeZone, 10, () => {
          logger.info('This is called every 10 seconds');
        });
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

      if (!active) {
        stopSingleBackgroundJob(name, monitorId);
      } else {
        // TODO: Add a resume method here
        logger.info('Resume monitor');
        startSingleJob(name, appTimeZone, 10, () => {
          logger.info('Resume after 10 seconds');
        });
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
  },
};
