import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Button,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Link, router } from 'expo-router';
import { gql } from '@apollo/client';

import { client } from '../../graphql/client';
import { AppContext } from '../../context/main';
import { loginAction } from '../../context/auth';

import theme from '../../../theme';

export default function SignUp() {
  const { dispatch } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (email: string, password: string) => {
    try {
      const { data, errors } = await client.mutate({
        mutation: CREATE_ACCOUNT,
        variables: {
          input: {
            email,
            password,
            firstName,
            lastName,
          },
        },
      });
      console.log('signup data', data.customerCreate);
      console.log('signup data', data.customerCreate.customerUserErrors);
      console.log('signup errors', errors);
      // if (data.customerAccessTokenCreate.customerAccessToken) {
      //   const token =
      //     data.customerAccessTokenCreate.customerAccessToken.accessToken;
      //   const expiresAt =
      //     data.customerAccessTokenCreate.customerAccessToken.expiresAt;
      //   loginAction(dispatch, token, expiresAt);
      //   router.push('/user');
      // }
    } catch (error) {
      console.error(error);
      console.error('error creating user');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/logo_gold.png')}
        style={styles.logo}
        resizeMode='contain'
      />
      {loading ? (
        <ActivityIndicator size='large' color={theme.colors.lightgold} />
      ) : (
        <>
          <View>
            <TextInput
              placeholder='First name'
              style={styles.input}
              onChangeText={setFirstName}
              placeholderTextColor={'white'}
            />
            <TextInput
              placeholder='Last name'
              style={styles.input}
              onChangeText={setLastName}
              placeholderTextColor={'white'}
            />
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
            onPress={() => handleSignup(email, password)}
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </Pressable>
          {isError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error creating account.</Text>
            </View>
          )}
          <View style={styles.linkContainer}>
            <Link style={styles.link} href='/'>
              Go Back
            </Link>
          </View>
        </>
      )}
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

export const CREATE_ACCOUNT = gql`
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        email
        firstName
        lastName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

/**
 * 
 *  LOG  signup data {"__typename": "CustomerCreatePayload", "customer": null, "customerUserErrors": [{"__typename": "CustomerUserError", "code": "INVALID", "field": [Array], "message": "Email is invalid"}]}
 LOG  signup data [{"__typename": "CustomerUserError", "code": "INVALID", "field": ["input", "email"], "message": "Email is invalid"}]
 LOG  signup errors undefined
 LOG  signup data {"__typename": "CustomerCreatePayload", "customer": null, "customerUserErrors": [{"__typename": "CustomerUserError", "code": "TAKEN", "field": [Array], "message": "Email has already been taken"}]}
 LOG  signup data [{"__typename": "CustomerUserError", "code": "TAKEN", "field": ["input", "email"], "message": "Email has already been taken"}]
 */
