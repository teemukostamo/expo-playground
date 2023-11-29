import { View, Text, Button } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function Product() {
  const local = useLocalSearchParams();

  return (
    <View>
      <Text>{local.handle}</Text>
      <Button onPress={() => router.back()} title='Go back' />
    </View>
  );
}
