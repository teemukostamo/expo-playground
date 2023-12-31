import { Slot } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import theme from '../../theme';

import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const Layout = () => {
  return (
    <View style={styles.container}>
      <Slot />
    </View>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.darkblue,
  },
});
