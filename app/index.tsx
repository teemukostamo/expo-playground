import { View, Text, StyleSheet } from 'react-native';
import { useContext } from 'react';
import { AppContext } from '../context/main';
import Login from './Login';

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
        <Text>Welcome to linecut screen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
