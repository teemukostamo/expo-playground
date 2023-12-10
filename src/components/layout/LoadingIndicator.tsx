import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import theme from '../../../theme';

const LoadingIndicator = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color={theme.colors.lightgold} />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

export default LoadingIndicator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontFamily: 'regular',
    fontSize: 16,
    padding: 10,
    color: 'white',
  },
});
