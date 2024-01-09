import React, { useState, useEffect } from 'react';
import { View, Text } from 'tamagui';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const OverlayMenu = ({ visible }: { visible: boolean }) => {
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    // Start the opening animation when the component mounts
    opacity.value = withTiming(1, { duration: 300 });
  }, [visible]);

  return (
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
          zIndex: 1000, // Make sure it's above all other content
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
    </Animated.View>
  );
};

export default OverlayMenu;
