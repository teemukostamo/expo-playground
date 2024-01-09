import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  quantity: number;
  setQuantity: (quantity: number) => void;
};

const Quantity = ({ quantity, setQuantity }: Props) => {
  return (
    <View style={styles.quantityContainer}>
      <Text style={{ marginRight: 10, fontSize: 10 }}>Qty:</Text>
      <TouchableOpacity
        onPress={() => setQuantity(quantity - 1)}
        style={styles.quantityButton}
        disabled={quantity === 1}
      >
        <Text>-</Text>
      </TouchableOpacity>
      <Text style={styles.quantity}>{quantity}</Text>
      <TouchableOpacity
        onPress={() => setQuantity(quantity + 1)}
        style={styles.quantityButton}
      >
        <Text>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Quantity;

const styles = StyleSheet.create({
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: 'black',
    width: 20,
    alignItems: 'center',
  },
  quantity: {
    marginHorizontal: 10,
  },
});
