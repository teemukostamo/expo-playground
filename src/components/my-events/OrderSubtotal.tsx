import { View, Text, StyleSheet } from 'react-native';
import type { Money } from '../../types';

type Props = {
  totalPrice: Money;
  totalTax: Money;
};

const OrderSubtotal = ({ totalPrice, totalTax }: Props) => {
  return (
    <View>
      <Text>
        order subtotal: {Number(totalPrice.amount).toFixed(2)}
        {totalPrice.currencyCode}
      </Text>
      <Text>
        taxes: {Number(totalTax.amount).toFixed(2)}
        {totalTax.currencyCode}
      </Text>
    </View>
  );
};

export default OrderSubtotal;
