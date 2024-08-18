import { mergeTypeDefs } from '@graphql-tools/merge';

import { monitorSchema } from './monitor';
import { notificationSchema } from './notification';
import { userSchema } from './user';

export const mergedGQLSchema = mergeTypeDefs([
  userSchema,
  notificationSchema,
  monitorSchema,
]);
