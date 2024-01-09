import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import HamburgerIcon from './HamburgerIcon';
import theme from '../../../theme';
import { useState } from 'react';
// Get the screen's width and height
const { width, height } = Dimensions.get('window');

// Calculate dimensions relative to screen size
const headerHeight = height * 0.1; // For example, 10% of the screen height
const logoWidth = width * 0.2; // 50% of the screen width
const logoHeight = headerHeight * 0.4; // 80% of header height

export default function Header() {
  return (
    <View style={styles.headerContainer}>
      <Link href='/'>
        <ImageBackground
          source={require('../../../assets/images/logo_white.png')}
          style={styles.headerLogo}
          resizeMode='contain'
          alt='Linecut Logo'
        />
      </Link>
      <HamburgerIcon />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
    backgroundColor: theme.colors.darkblue,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 10,
    maxWidth: 1100,
  },
  headerLogo: {
    width: logoWidth,
    height: logoHeight,
  },
});
