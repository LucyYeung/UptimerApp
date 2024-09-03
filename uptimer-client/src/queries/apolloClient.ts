'use client';

import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
  split,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { CachePersistor, LocalStorageWrapper } from 'apollo3-cache-persist';
import { DocumentNode, Kind, OperationTypeNode } from 'graphql';
import { createClient } from 'graphql-ws';

const httpUrl: string =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/graphql'
    : `${process.env.NEXT_PUBLIC_HTTP_SERVER_URL}/graphql`;
const wsUrl: string =
  process.env.NODE_ENV === 'development'
    ? 'ws://localhost:5000/graphql'
    : `${process.env.NEXT_PUBLIC_WS_SERVER_URL}/graphql`;

const httpLink: ApolloLink = createHttpLink({
  uri: httpUrl,
  credentials: 'include',
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: wsUrl,
    retryAttempts: 20,
    shouldRetry: () => true,
    on: {
      closed: () => console.log('Client closed'),
      connected: () => console.log('Client connected'),
    },
  })
);

const cache: InMemoryCache = new InMemoryCache();
let apolloPersistor: CachePersistor<NormalizedCacheObject> | null = null;

const initPersistorCache = async (): Promise<void> => {
  apolloPersistor = new CachePersistor({
    cache,
    storage: new LocalStorageWrapper(window.localStorage),
    debug: false,
    trigger: 'write',
  });
  await apolloPersistor.restore();
};

initPersistorCache();

const isSubscription = ({ query }: { query: DocumentNode }): boolean => {
  const definition = getMainDefinition(query);

  return (
    definition.kind === Kind.OPERATION_DEFINITION &&
    definition.operation === OperationTypeNode.SUBSCRIPTION
  );
};

const apolloClient: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: split(isSubscription, wsLink, httpLink),
  cache,
  devtools: {
    enabled: true, // set to false for production
  },
});

export { apolloClient, apolloPersistor };
