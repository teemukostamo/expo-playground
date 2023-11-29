import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function Testing() {
  return (
    <View>
      <Text>Testing</Text>
      <Link href='/'>home</Link>
    </View>
  );
}
