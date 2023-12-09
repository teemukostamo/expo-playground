import { gql, useQuery } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { AppContext } from '../../../context/main';
import { client } from '../../../client';
import { sortOrdersByEventDate } from '../../../src/utils/orderUtils';
import theme from '../../../theme';

export default function Page() {
  const [toggleOrders, setToggleOrders] = useState('upcoming');
  const { state } = useContext(AppContext);
  const { loading, error, data, refetch } = useQuery(GET_ORDERS, {
    variables: {
      customerAccessToken: state.auth.token,
    },
    client: client,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    refetch(); // This will refetch the query every time the component renders
  }, [refetch]);

  if (loading)
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color={theme.colors.lightgold} />
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  if (error) return <Text>Error: {error.message}</Text>;

  const { orders } = data.customer;
  const sortedOrders = sortOrdersByEventDate(orders);

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <Pressable onPress={() => setToggleOrders('upcoming')}>
          <Text
            style={[
              styles.text,
              toggleOrders === 'upcoming' && styles.selectedText,
            ]}
          >
            Upcoming events
          </Text>
        </Pressable>
        <Pressable onPress={() => setToggleOrders('past')}>
          <Text
            style={[
              styles.text,
              toggleOrders === 'past' && styles.selectedText,
            ]}
          >
            Past events
          </Text>
        </Pressable>
      </View>
      {toggleOrders === 'upcoming' ? (
        <View style={styles.eventsContainer}>
          {sortedOrders.upcoming.map((order) => {
            const { customAttributes } = order.node;
            const eventDate = customAttributes.find(
              (attr) => attr.key === '_event_date'
            )?.value;
            const eventName = customAttributes.find(
              (attr) => attr.key === '_event_name'
            )?.value;
            return (
              <View key={order.node.id}>
                <Text style={styles.text} key={order.node.id}>
                  {eventDate} {eventName}
                </Text>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.eventsContainer}>
          <View style={styles.eventsContainer}>
            {sortedOrders.past.map((order) => {
              const { customAttributes } = order.node;
              const eventDate = customAttributes.find(
                (attr: { key: string }) => attr.key === '_event_date'
              )?.value;
              const eventName = customAttributes.find(
                (attr: { key: string }) => attr.key === '_event_name'
              )?.value;
              return (
                <View key={order.node.id}>
                  <Text style={styles.text}>
                    {eventDate} {eventName}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventsContainer: {
    flex: 1,
  },
  text: {
    fontFamily: 'regular',
    fontSize: 16,
    padding: 10,
    color: 'white',
  },
  selectedText: {
    fontSize: 16,
    padding: 10,
    color: theme.colors.lightgold,
    borderBottomColor: 'white',
  },
});

export const GET_ORDERS = gql`
  query getCustomerOrders($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      firstName
      lastName
      email
      orders(first: 50, reverse: true) {
        edges {
          node {
            id
            name
            customAttributes {
              key
              value
            }
            orderNumber
            processedAt
            totalPriceV2 {
              amount
              currencyCode
            }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  quantity
                }
              }
            }
          }
        }
      }
    }
  }
`;
