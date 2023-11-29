import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  View,
  Platform,
} from 'react-native';
import { Slot } from 'expo-router';
import { useReducer, useCallback, useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppContext, initialState, mainReducer } from '../context/main';
import { loginAction } from '../context/auth';
import { getValueFor } from '../src/utils/SecureStorageUtil';
import theme from '../theme';

SplashScreen.preventAutoHideAsync();

export default function HomeLayout() {
  const [state, dispatch] = useReducer(mainReducer, initialState);
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

  const Container = Platform.OS === 'ios' ? SafeAreaView : View;

  return (
    <>
      <AppContext.Provider value={{ state, dispatch }}>
        <SafeAreaProvider>
          <Container onLayout={onLayoutRootView} style={styles.safeArea}>
            <StatusBar barStyle='light-content' />
            <Slot />
          </Container>
        </SafeAreaProvider>
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
