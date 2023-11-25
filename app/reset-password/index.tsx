import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
} from 'react-native';
import { Link, router } from 'expo-router';

import { client } from '../../client';
import { gql } from '@apollo/client';
import { AppContext } from '../../context/main';
import { loginAction } from '../../context/auth';

import theme from '../../theme';

export default function LoginForm() {
  const { dispatch } = useContext(AppContext);
  const [email, setEmail] = useState('');

  const handleReset = async (email: string) => {
    const { data, errors } = await client.mutate({
      mutation: RESET_PASSWORD,
      variables: {
        input: {
          email,
        },
      },
    });

    if (data.customerAccessTokenCreate.customerAccessToken) {
      const token =
        data.customerAccessTokenCreate.customerAccessToken.accessToken;
      const expiresAt =
        data.customerAccessTokenCreate.customerAccessToken.expiresAt;
      loginAction(dispatch, token, expiresAt);
      router.push('/user');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo_gold.png')}
        style={styles.logo}
        resizeMode='contain'
      />
      <View>
        <TextInput
          placeholder='Email'
          style={styles.input}
          onChangeText={setEmail}
          placeholderTextColor={'white'}
        />
      </View>

      <Pressable style={styles.button} onPress={() => handleReset(email)}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </Pressable>
      <View style={styles.linkContainer}>
        <Link style={styles.link} href='/'>
          Go Back
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    color: 'white',
  },
  logo: {
    width: 300,
    height: 200,
  },
  input: {
    height: 40,
    marginTop: 10,
    marginBottom: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderColor: theme.colors.darkgold,
    borderBottomWidth: 1,
    color: 'white',
    fontFamily: 'regular',
  },
  button: {
    marginTop: 10,
    backgroundColor: theme.colors.lightgold,
    color: 'white',
    fontFamily: 'regular',
    padding: 10,
    borderRadius: 7,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'regular',
    fontSize: 20,
  },
  linkContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 30,
    alignItems: 'center',
  },
  link: {
    color: 'white',
    fontFamily: 'regular',
    fontSize: 12,
    padding: 5,
  },
});

export const RESET_PASSWORD = gql`
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;
