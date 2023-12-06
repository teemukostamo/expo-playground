import { useContext, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { AppContext } from '../../../context/main';
import { gql, useQuery } from '@apollo/client';
import { client } from '../../../client';
import { router } from 'expo-router';
import { logoutAction } from '../../../context/auth';
import { deleteItemAsync } from '../../../src/utils/SecureStorageUtil';

export default function Page() {
  const { state, dispatch } = useContext(AppContext);
  const { loading, error, data, refetch } = useQuery(GET_USER, {
    variables: {
      customerAccessToken: state.auth.token,
    },
    client: client,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    refetch(); // This will refetch the query every time the component renders
  }, [refetch]);

  const handleLogout = async () => {
    logoutAction(dispatch, null, null);
    await deleteItemAsync('token');
    await deleteItemAsync('expiresAt');
    await deleteItemAsync('email');
    await deleteItemAsync('password');
    router.replace('/');
  };

  if (loading)
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );

  if (error) return <Text>Error: {error.message}</Text>;

  if (!data) return <Text>User not found</Text>;
  const { firstName, lastName, email, orders } = data.customer;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Welcome to Linecut {firstName} {lastName}
      </Text>
      <Text style={styles.text}>Your email: {email}</Text>
      <FlatList
        data={orders.edges}
        keyExtractor={({ node }) => node.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.text}>
              Order: {item.node.name} processedAt {item.node.processedAt}
            </Text>
          </View>
        )}
      />
      <View>
        <Pressable onPress={handleLogout}>
          <Text style={styles.text}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  text: {
    color: 'white',
  },
});

export const GET_USER = gql`
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      firstName
      lastName
      email
      orders(first: 10, reverse: true) {
        edges {
          node {
            id
            name
            orderNumber
            processedAt
            totalPriceV2 {
              amount
              currencyCode
            }
            lineItems(first: 5) {
              # This will get up to 5 items per order
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
