import { View, Text, StyleSheet } from 'react-native';

type Props = {
  error: string;
};

const LoadingIndicator = ({ error }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Error: {error}</Text>
    </View>
  );
};

export default LoadingIndicator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
  },
  text: {
    fontFamily: 'regular',
    fontSize: 16,
    padding: 10,
    color: 'white',
    textAlign: 'center',
  },
});
