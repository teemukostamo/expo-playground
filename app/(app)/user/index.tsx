import { useContext, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { AppContext } from '../../../context/main';
import { gql, useQuery } from '@apollo/client';
import { client } from '../../../client';
import { router } from 'expo-router';
import { logoutAction } from '../../../context/auth';
import { clearAsyncStorage } from '../../../src/utils/AsyncStorageUtil';
import { deleteItemAsync } from '../../../src/utils/SecureStorageUtil';
import LoadingIndicator from '../../../src/components/layout/LoadingIndicator';

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
    await clearAsyncStorage();
    router.replace('/');
  };

  if (loading) return <LoadingIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;

  if (!data) return <Text>User not found</Text>;
  const { firstName, lastName, email, orders } = data.customer;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Welcome to Linecut {firstName} {lastName}
      </Text>
      <Text style={styles.text}>Your email: {email}</Text>
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
    }
  }
`;
