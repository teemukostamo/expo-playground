import { View, Text, StyleSheet } from 'react-native';
import { useContext } from 'react';
import { AppContext } from '../../context/main';
import Login from './Login';
import { Link } from 'expo-router';

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
        <Link href='/testing'>testing link</Link>
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
