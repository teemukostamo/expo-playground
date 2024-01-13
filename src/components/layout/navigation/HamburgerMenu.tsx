import React, { useContext, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import theme from '../../../../theme';
import { AppContext } from '../../../context/main';

const HamburgerMenu = ({ toggleMenu }: any) => {
  const { state } = useContext(AppContext);
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withTiming(state.layout.isMenuOpen ? 45 : 0, {
      duration: 300,
    });
  }, [state.layout.isMenuOpen]);

  const topBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { translateY: state.layout.isMenuOpen ? 15 : 0 },
      ],
    };
  });

  const bottomBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${-rotation.value}deg` },
        { translateY: state.layout.isMenuOpen ? -15 : 0 },
      ],
    };
  });

  const middleBarOpacity = useAnimatedStyle(() => {
    return {
      opacity: withTiming(state.layout.isMenuOpen ? 0 : 1, { duration: 300 }),
    };
  });

  return (
    <TouchableOpacity
      onPress={toggleMenu}
      style={{
        width: 35,
        height: 24,
        justifyContent: 'space-between',
        flexDirection: 'column',
        marginRight: state.layout.isMenuOpen ? 0 : 10,
      }}
    >
      <Animated.View
        style={[
          {
            height: 4,
            backgroundColor: theme.colors.darkgold,
            borderRadius: 3,
          },
          topBarAnimatedStyle,
        ]}
      />
      <Animated.View
        style={[
          {
            height: 4,
            backgroundColor: theme.colors.darkgold,
            borderRadius: 3,
          },
          middleBarOpacity,
        ]}
      />
      <Animated.View
        style={[
          {
            height: 4,
            backgroundColor: theme.colors.darkgold,
            borderRadius: 3,
          },
          bottomBarAnimatedStyle,
        ]}
      />
    </TouchableOpacity>
  );
};

export default HamburgerMenu;
