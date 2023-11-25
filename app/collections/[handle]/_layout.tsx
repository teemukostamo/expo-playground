import { Slot } from 'expo-router';
import { View, Text } from 'react-native';

const Layout = () => {
  return (
    <View>
      <Text>Layout</Text>
      <Slot />
    </View>
  );
};

export default Layout;
