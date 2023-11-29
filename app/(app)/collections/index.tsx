import { Text, FlatList, View, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useQuery, gql } from '@apollo/client';

import CollectionCard from './CollectionCard';
import { client } from '../../../client';
import theme from '../../../theme';

export default function Page() {
  const { loading, error, data } = useQuery(GET_ALL_COLLECTIONS, {
    variables: { first: 20 }, // adjust the number to the number of collections you want to fetch
    client: client,
  });

  if (loading)
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  if (error) return <Text>Error: {error.message}</Text>;

  if (!data) return <Text>No collections found.</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={data.collections.edges}
        numColumns={2}
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
        }
      }
    }
  }
`;
