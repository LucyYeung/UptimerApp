import { AppContext, IMonitorArgs } from '@app/interfaces/monitor.interface';
import logger from '@app/server/logger';
import { createMonitor, toggleMonitor } from '@app/services/monitor.service';
import { startSingleJob, stopSingleBackgroundJob } from '@app/utils/jobs';
import { appTimeZone, authenticateGraphQLRoute } from '@app/utils/utils';

export const MonitorResolver = {
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
  },
};
