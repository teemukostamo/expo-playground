import React, { useState, useEffect, useContext } from 'react';
import { View, Text } from 'tamagui';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { toggleMenuAction } from '../../context/layout';
import { AppContext } from '../../context/main';

const OverlayMenu = ({ isOpen }: { isOpen: boolean }) => {
  const { state, dispatch } = useContext(AppContext);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    // Start the opening animation when the component mounts
    opacity.value = withTiming(1, { duration: 1600 });
  }, [isOpen]);

  const handleClose = () => {
    toggleMenuAction(dispatch, !state.layout.isMenuOpen);
  };

  return isOpen ? (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: isOpen ? 1 : 0,
          height: '100%',
        },
        animatedStyle,
      ]}
    >
      <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
        <Text style={{ marginBottom: 10, color: 'white' }}>Menu Item 1</Text>
        <Text style={{ marginBottom: 10, color: 'white' }}>Menu Item 1</Text>
        <Text style={{ marginBottom: 10, color: 'white' }}>Menu Item 1</Text>
        {/* Add more menu items as needed */}
      </View>
      <Pressable onPress={handleClose}>
        <Text style={{ color: 'white' }}>Close</Text>
      </Pressable>
    </Animated.View>
  ) : null;
};

export default OverlayMenu;
