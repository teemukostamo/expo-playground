import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'https://teemus-dev-store.myshopify.com/api/2021-04/graphql.json',
  headers: {
    'X-Shopify-Storefront-Access-Token': '12e87ebb7da1541e13723a43ff1e7454',
  },
});

// Initialize Apollo Client with the Shopify Storefront API endpoint and headers
export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
