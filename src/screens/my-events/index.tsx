import { gql, useQuery } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { AppContext } from '../../context/main';
import { client } from '../../graphql/client';
import { sortOrdersByEventDate } from '../../../src/utils/orderUtils';
import OrderCard from '../../components/my-events/OrderCard';
import LoadingIndicator from '../../../src/components/layout/LoadingIndicator';
import Error from '../../../src/components/layout/Error';

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

  if (loading) return <LoadingIndicator />;
  if (error) return <Error error={error.message} />;

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
          <FlatList
            data={sortedOrders.upcoming}
            keyExtractor={({ node }) => node.id.toString()}
            renderItem={({ item }) => <OrderCard order={item.node} />}
          />
        </View>
      ) : (
        <View style={styles.eventsContainer}>
          <FlatList
            data={sortedOrders.past}
            keyExtractor={({ node }) => node.id.toString()}
            renderItem={({ item }) => <OrderCard order={item.node} />}
          />
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
      orders(first: 100, reverse: true) {
        edges {
          node {
            id
            name
            customAttributes {
              key
              value
            }
            processedAt
            totalPrice {
              amount
              currencyCode
            }
            totalTax {
              amount
              currencyCode
            }
            lineItems(first: 100) {
              edges {
                node {
                  variant {
                    id
                  }
                  title
                  currentQuantity
                  customAttributes {
                    key
                    value
                  }
                  discountedTotalPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
