import { MonitorResolver } from './monitor';
import { NotificationResovler } from './notification';
import { UserResolver } from './user';

export const resolvers = [UserResolver, NotificationResovler, MonitorResolver];
