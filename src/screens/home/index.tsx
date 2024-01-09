import { View, StyleSheet, ScrollView, Button } from 'react-native';
import { useContext } from 'react';
import { AppContext } from '../../context/main';
import Login from '../../components/layout/Login';
import { Avatar, XStack, Text } from 'tamagui';
import OverlayMenu from '../../components/layout/OverlayMenu';

export default function Page() {
  const { state } = useContext(AppContext);
  if (state.auth.token === null) {
    return (
      <View style={styles.container}>
        <Login />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text color='$linecutDarkGold' style={styles.text}>
          SKIP THE LINE
        </Text>
        <Text color='$linecutDarkGold'>SKIP THE LINE</Text>

        <XStack alignItems='center' space='$6'>
          <Avatar circular size='$10'>
            <Avatar.Image
              accessibilityLabel='Cam'
              src='https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80'
            />
            <Avatar.Fallback backgroundColor='$blue10' />
          </Avatar>

          <Avatar circular size='$8'>
            <Avatar.Image
              accessibilityLabel='Nate Wienert'
              src='https://images.unsplash.com/photo-1531384441138-2736e62e0919?&w=100&h=100&dpr=2&q=80'
            />
            <Avatar.Fallback delayMs={600} backgroundColor='$blue10' />
          </Avatar>
        </XStack>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'title',
    fontSize: 30,
  },
});
