import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { WebView } from 'react-native-webview';

import { useLocalSearchParams } from 'expo-router';

export default function Checkout() {
  const { webUrl } = useLocalSearchParams();

  const handleNavigationChange = (navState: { url: string }) => {
    // Check the URL and determine if it's the thank you page
    if (navState.url.includes('thank-you')) {
      router.replace('/checkout/thankyou');
      // If it is, update the state
      // You could also perform additional actions here, such as analytics tracking
    }
  };

  const ActivityIndicatorElement = () => {
    //making a view to show to while loading the webpage
    return (
      <ActivityIndicator
        color='#009688'
        size='large'
        //  style={styles.activityIndicatorStyle}
      />
    );
  };

  return webUrl && typeof webUrl === 'string' ? (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        style={styles.webview}
        source={{
          uri: webUrl,
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error: ', nativeEvent);
        }}
        renderLoading={ActivityIndicatorElement}
        startInLoadingState={true}
        onNavigationStateChange={handleNavigationChange}
      />
      <Button onPress={() => router.back()} title='Go back' />
    </View>
  ) : (
    <View style={styles.flexContainer}>
      <Text>Checkout</Text>
      <Button onPress={() => router.back()} title='Go back' />
    </View>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center', // Center the WebView vertically
    alignItems: 'center', // Center the WebView horizontally
    backgroundColor: '#F5FCFF', // Optional background color
  },
  webview: {
    width: 400, // Width of the WebView takes all available width
    flex: 1, // The WebView should also expand to fill the available vertical space
  },
});
