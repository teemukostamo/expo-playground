import { View, Text, StyleSheet } from 'react-native';

import { LineItemNode } from '../../../src/types';
import CartCustomAttributes from '../../(collections)/collections/CartCustomAttributes';

type Props = {
  node: LineItemNode;
};

const OrderLineItem = ({ node }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.productTitle}>{node.title}</Text>
        <View>
          <Text style={styles.productTitle}>
            {Number(node.discountedTotalPrice.amount).toFixed(2)}
            {node.discountedTotalPrice.currencyCode}
          </Text>
        </View>
      </View>
      <Text>Quantity: {node.currentQuantity}</Text>
      <CartCustomAttributes customAttributes={node.customAttributes} />
    </View>
  );
};

export default OrderLineItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productTitle: {
    fontWeight: 'bold',
    fontFamily: 'title',
  },
});
