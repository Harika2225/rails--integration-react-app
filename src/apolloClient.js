import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:8080/v1/graphql',
  }),
  cache: new InMemoryCache(),
});

export default client;
