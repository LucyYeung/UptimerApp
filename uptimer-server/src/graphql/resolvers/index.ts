import { HeartbeatResolver } from './heartbeat';
import { MonitorResolver } from './monitor';
import { NotificationResovler } from './notification';
import { SSLMonitorResolver } from './ssl';
import { UserResolver } from './user';

export const resolvers = [
  UserResolver,
  NotificationResovler,
  MonitorResolver,
  HeartbeatResolver,
  SSLMonitorResolver,
];
