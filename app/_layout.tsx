import { StyleSheet, SafeAreaView, StatusBar, View } from 'react-native';
import { Slot } from 'expo-router';
import Header from './Header';
import Footer from './Footer';
import { useReducer, useCallback, useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { AppContext, initialState, mainReducer } from '../context/main';
import { loginAction } from '../context/auth';
import { getValueFor } from '../src/utils/SecureStorageUtil';
import theme from '../theme';

SplashScreen.preventAutoHideAsync();

export default function HomeLayout() {
  const [state, dispatch] = useReducer(mainReducer, initialState);
  const { auth } = state;
  const [fontsLoaded, fontError] = useFonts({
    regular: require('../assets/fonts/Montserrat-Regular.ttf'),
    title: require('../assets/fonts/BarlowCondensed-Bold.ttf'),
  });

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

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <AppContext.Provider value={{ state, dispatch }}>
        <SafeAreaView onLayout={onLayoutRootView} style={styles.safeArea}>
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
        </SafeAreaView>
      </AppContext.Provider>
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
