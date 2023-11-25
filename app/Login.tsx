import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import { Link } from 'expo-router';

import { save } from '../src/utils/SecureStorageUtil';
import { client } from '../client';
import { gql } from '@apollo/client';
import { AppContext } from '../context/main';
import { loginAction } from '../context/auth';

import theme from '../theme';

export default function LoginForm() {
  const { dispatch } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, errors } = await client.mutate({
        mutation: LOGIN,
        variables: {
          input: {
            email,
            password,
          },
        },
      });

      if (data.customerAccessTokenCreate.customerUserErrors.length > 0) {
        setIsError(true);
      }

      if (data.customerAccessTokenCreate.customerAccessToken) {
        const token =
          data.customerAccessTokenCreate.customerAccessToken.accessToken;
        const expiresAt =
          data.customerAccessTokenCreate.customerAccessToken.expiresAt;

        await save('token', token);
        await save('expiresAt', expiresAt);
        await save('email', email);
        await save('password', password);

        loginAction(dispatch, token, expiresAt);
      }
    } catch (error) {
      console.error('error logging in');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <ActivityIndicator size='large' color={theme.colors.lightgold} />
  ) : (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo_gold.png')}
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
        <TextInput
          placeholder='Password'
          placeholderTextColor={'white'}
          style={styles.input}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
      </View>

      <Pressable
        style={styles.button}
        onPress={() => handleLogin(email, password)}
      >
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
      {isError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Error logging in. Please check your credentials
          </Text>
        </View>
      )}
      <View style={styles.linkContainer}>
        <Link style={styles.link} href='/reset-password'>
          Forgot password
        </Link>
        <Link style={styles.link} href='/signup'>
          Create Account
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
  errorContainer: {
    padding: 10,
    marginTop: 10,
  },
  errorText: {
    color: theme.colors.errorText,
    alignSelf: 'center',
  },
});

export const LOGIN = gql`
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
