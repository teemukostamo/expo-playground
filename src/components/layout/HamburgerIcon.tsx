import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import theme from '../../../theme';

const HamburgerIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const rotation = useSharedValue(0);

  const topBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: isOpen ? `${rotation.value}deg` : `${-rotation.value}deg` },
        { translateY: isOpen ? 15 : 0 },
      ],
    };
  });

  const bottomBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${-rotation.value}deg` },
        { translateY: isOpen ? -15 : 0 },
      ],
    };
  });

  const middleBarOpacity = useAnimatedStyle(() => {
    return {
      opacity: isOpen ? 0 : 1,
    };
  });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    rotation.value = withTiming(isOpen ? 0 : 45, { duration: 300 });
  };

  return (
    <TouchableOpacity
      onPress={toggleMenu}
      style={{
        width: 35,
        height: 24,
        justifyContent: 'space-between',
        flexDirection: 'column',
        marginRight: isOpen ? 0 : 10,
        zIndex: 1000,
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

export default HamburgerIcon;