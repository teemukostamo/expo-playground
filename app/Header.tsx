import { View, Text, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';

import theme from '../theme';

export default function Header() {
  return (
    <View style={styles.header}>
      <Link href='/'>
        <Image
          source={require('../assets/images/logo_white.png')}
          style={styles.headerText}
          resizeMode='contain'
        />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60, // You can adjust this value as needed
    backgroundColor: theme.colors.darkblue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    width: 100,
    height: 50,
  },
});
