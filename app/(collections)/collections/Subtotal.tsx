import { View, Text, StyleSheet } from 'react-native';

import type { CartItem } from '../../../src/types';

const Subtotal = ({ cart }: { cart: CartItem[] }) => {
  const subtotal = cart.reduce((acc, item) => {
    return acc + item.quantity * item.price;
  }, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Subtotal: €{subtotal.toFixed(2)}</Text>
    </View>
  );
};

export default Subtotal;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  text: {
    fontSize: 20,
  },
});
