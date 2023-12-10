import { Text, FlatList, View, Button, StyleSheet } from 'react-native';
import { useQuery, gql } from '@apollo/client';

import CollectionCard from './CollectionCard';
import { client } from '../../../client';
import theme from '../../../theme';
import LoadingIndicator from '../../../src/components/layout/LoadingIndicator';

export default function Page() {
  const { loading, error, data } = useQuery(GET_ALL_COLLECTIONS, {
    variables: { first: 20 }, // adjust the number to the number of collections you want to fetch
    client: client,
  });

  if (loading) return <LoadingIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;

  if (!data) return <Text>No collections found.</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={data.collections.edges}
        keyExtractor={({ node }) => node.id.toString()}
        renderItem={({ item }) => <CollectionCard collection={item.node} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.darkblue,
  },
});

export const GET_ALL_COLLECTIONS = gql`
  query GetAllCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          image {
            src
            altText
          }
          venue_name: metafield(namespace: "custom", key: "venue_name") {
            value
          }
          city: metafield(namespace: "custom", key: "city") {
            value
          }
          event_name: metafield(namespace: "custom", key: "event_name") {
            value
          }
          event_date: metafield(namespace: "custom", key: "event_date") {
            value
          }
        }
      }
    }
  }
`;
