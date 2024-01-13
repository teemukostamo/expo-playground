import { useContext, useEffect } from 'react';
import { toggleMenuAction } from '../../../context/layout';
import { AppContext } from '../../../context/main';
import { Text, View } from 'tamagui';
import { Modal, SafeAreaView } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import HamburgerMenu from './HamburgerMenu';

const Navigation = () => {
  const { state, dispatch } = useContext(AppContext);

  const toggleMenu = () => {
    toggleMenuAction(dispatch, !state.layout.isMenuOpen);
  };

  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    // Start the opening animation when the component mounts
    opacity.value = withTiming(1, { duration: 3000 });
    return () => {
      opacity.value = withTiming(0, { duration: 3000 });
    };
  }, []);

  return (
    <>
      <HamburgerMenu isOpen={state.layout.isMenuOpen} toggleMenu={toggleMenu} />
      <Modal visible={state.layout.isMenuOpen} transparent={false}>
        <SafeAreaView style={{ flex: 1 }}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                justifyContent: 'flex-start',
                alignItems: 'flex-end',
                zIndex: state.layout.isMenuOpen ? 1 : 0,
                paddingTop: 55,
                paddingRight: 10,
                //   height: '100%',
              },
              animatedStyle,
            ]}
          >
            <HamburgerMenu
              toggleMenu={toggleMenu}
              isOpen={!state.layout.isMenuOpen}
            />
            <View>
              <Text style={{ marginTop: 10, marginBottom: 10, color: 'white' }}>
                Menu Item 1
              </Text>
              <Text style={{ marginBottom: 10, color: 'white' }}>
                Menu Item 1
              </Text>
              <Text style={{ marginBottom: 10, color: 'white' }}>
                Menu Item 1
              </Text>
            </View>
          </Animated.View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default Navigation;
