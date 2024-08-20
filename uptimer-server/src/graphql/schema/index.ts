import { mergeTypeDefs } from '@graphql-tools/merge';

import { heartbeatSchema } from './heartbeat';
import { monitorSchema } from './monitor';
import { notificationSchema } from './notification';
import { userSchema } from './user';

export const mergedGQLSchema = mergeTypeDefs([
  userSchema,
  notificationSchema,
  monitorSchema,
  heartbeatSchema,
]);
