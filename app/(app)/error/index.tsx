import { router } from 'expo-router';
import { View, Text, Button } from 'react-native';

export default function ErrorPage() {
  return (
    <View>
      <Text>404</Text>
      <Button onPress={() => router.push('/')} title='Go back' />
    </View>
  );
}
