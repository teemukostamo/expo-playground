import { router } from 'expo-router';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function ThankYou() {
  return (
    <View style={styles.flexContainer}>
      <Text>Thank you for your purchase!</Text>
      <Button onPress={() => router.replace('/')} title='Home' />
    </View>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
