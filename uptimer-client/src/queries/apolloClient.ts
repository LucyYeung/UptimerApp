import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
} from '@apollo/client';

const httpUrl: string = 'http://localhost:5000/graphql';

const httpLink: ApolloLink = createHttpLink({
  uri: httpUrl,
  credentials: 'include',
});

const cache: InMemoryCache = new InMemoryCache();

const apolloClient: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: httpLink,
  cache,
  devtools: {
    enabled: true, // set to false for production
  },
});

export { apolloClient };
