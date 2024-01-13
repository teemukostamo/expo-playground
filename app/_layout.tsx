import { useReducer, useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider, Theme } from 'tamagui';

import { AppContext, initialState, mainReducer } from '../src/context/main';
import { loginAction } from '../src/context/auth';
import { getValueFor } from '../src/utils/SecureStorageUtil';
import config from '../tamagui.config';

import App from '../src/App';

SplashScreen.preventAutoHideAsync();

export default function HomeLayout() {
  const [state, dispatch] = useReducer(mainReducer, initialState);

  const [fontsLoaded, fontError] = useFonts({
    regular: require('../assets/fonts/Montserrat-Regular.ttf'),
    title: require('../assets/fonts/BarlowCondensed-Bold.ttf'),
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
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

  return (
    <>
      <TamaguiProvider config={config}>
        <AppContext.Provider value={{ state, dispatch }}>
          <SafeAreaProvider>
            <Theme name={state.layout.theme}>
              <App />
            </Theme>
          </SafeAreaProvider>
        </AppContext.Provider>
      </TamaguiProvider>
    </>
  );
}
