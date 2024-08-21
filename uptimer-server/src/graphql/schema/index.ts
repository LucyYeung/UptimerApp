import { mergeTypeDefs } from '@graphql-tools/merge';

import { heartbeatSchema } from './heartbeat';
import { monitorSchema } from './monitor';
import { notificationSchema } from './notification';
import { sslMonitorSchema } from './ssl';
import { userSchema } from './user';

export const mergedGQLSchema = mergeTypeDefs([
  userSchema,
  notificationSchema,
  monitorSchema,
  heartbeatSchema,
  sslMonitorSchema,
]);
