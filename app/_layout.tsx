import { StyleSheet, SafeAreaView, StatusBar, View } from 'react-native';
import { Slot } from 'expo-router';
import { useReducer, useCallback, useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getLocales } from 'expo-localization';

import { AppContext, initialState, mainReducer } from '../context/main';
import { loginAction } from '../context/auth';
import { setLanguageAction } from '../context/locale';
import { getValueFor } from '../src/utils/SecureStorageUtil';
import { storeData, getData } from '../src/utils/AsyncStorageUtil';
import { AVAILABLE_LANGUAGES } from '../src/constants';
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
      console.log('bootstrapAsync runs');
      // const lang = await getData('lang');
      // if (lang) {
      //   setLanguageAction(dispatch, lang);
      // } else {
      //   let deviceLang = getLocales()[0].languageCode;
      //   if (!AVAILABLE_LANGUAGES.includes(deviceLang)) {
      //     deviceLang = 'en';
      //   }
      //   setLanguageAction(dispatch, deviceLang);
      //   storeData('lang', deviceLang);
      // }
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
