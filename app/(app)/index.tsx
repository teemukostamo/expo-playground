import { View, StyleSheet, ScrollView, Text, Button } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useContext } from 'react';
import { AppContext } from '../../context/main';
import Login from '../../src/components/layout/Login';
import theme from '../../theme';

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
        <Text style={styles.text}>SKIP THE LINE</Text>
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
    color: theme.colors.lightgold,
  },
});
