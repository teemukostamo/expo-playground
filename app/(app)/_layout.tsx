import { StyleSheet, StatusBar, View } from 'react-native';
import { Slot } from 'expo-router';
import Header from '../../src/components/layout/Header';
import Footer from '../../src/components/layout/Footer';
import { useReducer, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import { initialState, mainReducer } from '../../src/context/main';
import { loginAction } from '../../src/context/auth';
import { getValueFor } from '../../src/utils/SecureStorageUtil';
import theme from '../../theme';

SplashScreen.preventAutoHideAsync();

export default function HomeLayout() {
  const [state, dispatch] = useReducer(mainReducer, initialState);
  const { auth } = state;

  useEffect(() => {
    const bootstrapAsync = async () => {
      const token = await getValueFor('token');
      const expiresAt = await getValueFor('expiresAt');

      if (token && expiresAt) {
        loginAction(dispatch, token, expiresAt);
      }
    };

    bootstrapAsync();
  }, []);

  return (
    <>
      <StatusBar barStyle='light-content' />
      {auth.token === null ? (
        <View style={styles.container}>
          <Slot />
        </View>
      ) : (
        <View style={styles.container}>
          <Header />
          <Slot />
          <Footer />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.darkblue,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.darkblue,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
