import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { Link } from 'expo-router';

import theme from '../../../theme';

// Get the screen's width and height
const { width, height } = Dimensions.get('window');

// Calculate dimensions relative to screen size
const headerHeight = height * 0.1; // For example, 10% of the screen height
const logoWidth = width * 0.3; // 50% of the screen width
const logoHeight = headerHeight * 0.5; // 80% of header height

export default function Header() {
  return (
    <View style={styles.headerContainer}>
      <Link href='/'>
        <ImageBackground
          source={require('../../../assets/images/logo_white.png')}
          style={styles.headerLogo}
          resizeMode='contain'
        />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
    backgroundColor: theme.colors.darkblue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLogo: {
    width: logoWidth,
    height: logoHeight,
  },
});
