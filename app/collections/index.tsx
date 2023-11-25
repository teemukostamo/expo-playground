import { Text, FlatList, View, Button, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { router } from 'expo-router';

import { useQuery, gql } from '@apollo/client';
import { client } from '../../client';

export default function Page() {
  const { loading, error, data } = useQuery(GET_ALL_COLLECTIONS, {
    variables: { first: 10 }, // adjust the number to the number of collections you want to fetch
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
        keyExtractor={({ node }) => node.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Link
              href={{
                pathname: '/collections/[handle]',
                params: { handle: item.node.handle },
              }}
            >
              {item.node.title}
            </Link>
          </View>
        )}
      />
      <Button onPress={() => router.back()} title='Go back' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
          description
          image {
            src
            altText
          }
        }
      }
    }
  }
`;
