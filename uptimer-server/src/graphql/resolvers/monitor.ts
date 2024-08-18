import { AppContext, IMonitorArgs } from '@app/interfaces/monitor.interface';
import logger from '@app/server/logger';
import { createMonitor } from '@app/services/monitor.service';
import { authenticateGraphQLRoute } from '@app/utils/utils';

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
      }

      return {
        monitors: [monitor],
      };
    },
  },
};
