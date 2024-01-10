import { View, StyleSheet } from 'react-native';
import { useContext } from 'react';
import { AppContext } from '../../context/main';
import Login from '../../components/layout/Login';
import { Avatar, XStack, Text } from 'tamagui';

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
