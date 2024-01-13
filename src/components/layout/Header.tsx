import { useContext } from 'react';
import { StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { Theme, View } from 'tamagui';
import { Link } from 'expo-router';
import HamburgerIcon from './HamburgerIcon';
import theme from '../../../theme';
import { AppContext } from '../../context/main';
import OverlayMenu from './OverlayMenu';
import { toggleMenuAction } from '../../context/layout';
// Get the screen's width and height
const { width, height } = Dimensions.get('window');

// Calculate dimensions relative to screen size
const headerHeight = height * 0.1; // For example, 10% of the screen height
const logoWidth = width * 0.2; // 50% of the screen width
const logoHeight = headerHeight * 0.4; // 80% of header height

export default function Header() {
  const { state, dispatch } = useContext(AppContext);

  const toggleMenu = () => {
    toggleMenuAction(dispatch, !state.layout.isMenuOpen);
  };
  const logoWhite = require('../../../assets/images/logo_white.png');
  const logoGold = require('../../../assets/images/logo_gold.png');
  return (
    <Theme name={state.layout.theme}>
      <View backgroundColor='$background' style={styles.headerContainer}>
        <Link href='/'>
          <ImageBackground
            source={state.layout.theme === 'light' ? logoGold : logoWhite}
            style={styles.headerLogo}
            resizeMode='contain'
            alt='Linecut Logo'
          />
        </Link>
        <HamburgerIcon
          toggleMenu={toggleMenu}
          isOpen={state.layout.isMenuOpen}
        />
        <OverlayMenu isOpen={state.layout.isMenuOpen} />
      </View>
    </Theme>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
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
