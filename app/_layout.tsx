import { StyleSheet, SafeAreaView, StatusBar, View } from 'react-native';
import { Slot } from 'expo-router';
import { useReducer, useCallback, useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, createTheme } from '@rneui/themed';
import { Button, Icon } from '@rneui/base';

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

  // const theme = createTheme({
  //   lightColors: {
  //     primary: '#D39C2E',
  //   },
  //   darkColors: {
  //     primary: '#D39C2E',
  //     background: '#002A46',
  //   },
  //   components: {
  //     Button: {
  //       titleStyle: {
  //         color: 'red',
  //       },
  //     },
  //   },
  //   mode: 'light',
  // });

  return (
    <>
      {/* <ThemeProvider
        theme={createTheme({
          lightColors: {
            primary: '#D39C2E',
          },
          darkColors: {
            primary: '#D39C2E',
            background: '#002A46',
          },
          components: {
            Button: {
              titleStyle: {
                color: 'red',
              },
            },
          },
          mode: 'light',
        })}
      > */}
      <AppContext.Provider value={{ state, dispatch }}>
        <SafeAreaProvider>
          <SafeAreaView onLayout={onLayoutRootView} style={styles.safeArea}>
            <StatusBar barStyle='light-content' />
            {state.auth.token === null ? (
              <View style={styles.container}>
                <Slot />
              </View>
            ) : (
              <Slot />
            )}
          </SafeAreaView>
        </SafeAreaProvider>
      </AppContext.Provider>
      {/* </ThemeProvider> */}
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
