import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function Page() {
  return (
    <View style={styles.container}>
      <Link style={styles.link} href='/collections'>
        collections
      </Link>
      <Text>search</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  link: {
    color: 'white',
    backgroundColor: 'teal',
    padding: 10,
  },
});
