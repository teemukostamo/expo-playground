import { View, Text, StyleSheet } from 'react-native';

import { LineItemNode } from '../../../src/types';
import CartCustomAttributes from '../../(collections)/collections/CartCustomAttributes';
import theme from '../../../theme';

type Props = {
  node: LineItemNode;
};

const OrderLineItem = ({ node }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.productTitle}>{node.title}</Text>
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
  productTitle: {
    fontWeight: 'bold',
    fontFamily: 'title',
  },
});
