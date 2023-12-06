import { View, FlatList, StyleSheet } from 'react-native';
import ProductModal from './ProductModal';
import type { CartItem } from '../../../src/types';

type Props = {
  pickupTime?: string;
  products: any[];
  addToCart: (product: Omit<CartItem, 'customAttributes'>) => void;
};

const ProductListing = ({ products, addToCart }: Props) => {
  return (
    <View style={styles.container}>
      <View>
        <FlatList
          data={products}
          keyExtractor={({ node }) => node.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.container}>
              <ProductModal addToCart={addToCart} product={item.node} />
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ProductListing;
