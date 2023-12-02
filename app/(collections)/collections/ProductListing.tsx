import { View, Text, FlatList, StyleSheet } from 'react-native';
import ProductModal from './ProductModal';
import { CustomAttribute } from '../../../src/types';

interface CartItem {
  variantId: string; // Unique identifier for the item, often the product variant ID
  title: string; // Title of the product
  variantTitle?: string; // Title of the variant, if applicable
  price: number; // Price of the item
  quantity: number; // Quantity of this item in the cart
  imageSrc?: string; // URL of the item's image
  customAttributes: CustomAttribute[]; // Custom attributes associated with the item
  // Add any other relevant fields, like size, color, etc.
}

type Props = {
  pickupLocation: string;
  pickupTime?: string;
  products: any[];
  addToCart: (product: CartItem) => void;
};

const ProductListing = ({ pickupLocation, products, addToCart }: Props) => {
  return (
    <View style={styles.container}>
      {pickupLocation !== '' && (
        <View>
          <Text style={{ color: 'white' }}>
            showing products for {pickupLocation}
          </Text>
          <FlatList
            data={products.filter((product) =>
              product.node.pickup_location_filter.value.includes(
                '' + pickupLocation
              )
            )}
            keyExtractor={({ node }) => node.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.container}>
                <ProductModal
                  pickupLocation={pickupLocation}
                  addToCart={addToCart}
                  product={item.node}
                />
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ProductListing;
