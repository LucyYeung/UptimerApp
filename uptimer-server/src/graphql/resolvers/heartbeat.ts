import {
  IHeartbeat,
  IHeartbeatArgs,
} from '@app/interfaces/heartbeat.interface';
import { AppContext } from '@app/interfaces/monitor.interface';
import { getHeartBeats } from '@app/services/monitor.service';
import { authenticateGraphQLRoute } from '@app/utils/utils';

export const HeartbeatResolver = {
  Query: {
    getHeartbeats: async (
      _: undefined,
      args: IHeartbeatArgs,
      context: AppContext,
    ) => {
      const { req } = context;
      authenticateGraphQLRoute(req);

      const { type, monitorId, duration } = args;
      const heartbeats = getHeartBeats(type, monitorId, parseInt(duration));
      return {
        heartbeats,
      };
    },
  },
  HeartBeat: {
    timestamp: (heartbeat: IHeartbeat) => JSON.stringify(heartbeat.timestamp),
  },
};
