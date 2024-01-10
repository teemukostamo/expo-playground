import { Text, FlatList, View, Button, StyleSheet } from 'react-native';
import { useQuery, gql } from '@apollo/client';
import { parseISO, isToday, isFuture } from 'date-fns';

import CollectionCard from '../../components/collections/CollectionCard';
import { client } from '../../graphql/client';
import theme from '../../../theme';
import LoadingIndicator from '../../components/layout/LoadingIndicator';
import Error from '../../components/layout/Error';

function isTodayOrFuture(dateString: string) {
  // Parse the date string into a Date object
  const date = parseISO(dateString);

  // Check if the date is either today or in the future
  return isToday(date) || isFuture(date);
}

export default function Page() {
  const { loading, error, data } = useQuery(GET_ALL_COLLECTIONS, {
    variables: { first: 20 }, // adjust the number to the number of collections you want to fetch
    client: client,
  });

  if (loading) return <LoadingIndicator />;
  if (error) return <Error error={error.message} />;

  if (!data) return <Text>No collections found.</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={data.collections.edges.filter(
          (item: { node: { event_date: { value: string } } }) =>
            isTodayOrFuture(item.node.event_date.value)
        )}
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
