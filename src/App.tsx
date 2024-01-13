import { StyleSheet, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Slot } from 'expo-router';
import { useCallback, useContext } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { View, useTheme } from 'tamagui';

import { AppContext } from '../src/context/main';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { state } = useContext(AppContext);
  const theme = useTheme();
  const backgroundColor = theme.background.get();

  const [fontsLoaded, fontError] = useFonts({
    regular: require('../assets/fonts/Montserrat-Regular.ttf'),
    title: require('../assets/fonts/BarlowCondensed-Bold.ttf'),
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

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
      <SafeAreaView
        onLayout={onLayoutRootView}
        style={{ flex: 1, backgroundColor }}
      >
        {Platform.OS === 'android' && <View height={22} />}
        <StatusBar
          animated
          style={state.layout.theme === 'dark' ? 'light' : 'dark'}
        />
        {state.auth.token === null ? (
          <View
            backgroundColor='$background'
            flex={1}
            alignItems='center'
            justifyContent='center'
          >
            <Slot />
          </View>
        ) : (
          <Slot />
        )}
      </SafeAreaView>
    </>
  );
}
