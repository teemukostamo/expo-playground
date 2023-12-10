import { View, StyleSheet, ScrollView, Text, Button } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { useContext } from 'react';
import { AppContext } from '../../context/main';
import Login from './Login';
import { Link } from 'expo-router';
import theme from '../../theme';

export default function Page() {
  const { state } = useContext(AppContext);
  const width = useSharedValue(100);

  const handlePress = () => {
    width.value = width.value + 50;
  };

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
