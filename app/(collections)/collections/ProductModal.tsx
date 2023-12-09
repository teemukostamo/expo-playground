import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import type { CartItem } from '../../../src/types';
import theme from '../../../theme';
import ProductVariants from './ProductVariants';

type Props = {
  addToCart: (product: Omit<CartItem, 'customAttributes'>) => void;
  product: {
    title: string;
    id: string;
    description: string;
    variants: any;
    images: any;
    pickup_location_selection: {
      value: string;
    };
    pickup_time_selection: {
      value: string;
    };
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
  };
};

const screenHeight = Dimensions.get('window').height;

export default function ProductModal({ product, addToCart }: Props) {
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants.edges[0].node.id
  );
  const [selectedVariantPrice, setSelectedVariantPrice] = useState(
    product.variants.edges[0].node.price
  );
  const [quantity, setQuantity] = useState(1);
  const hasOnlyDefaultVariant =
    product.variants.edges.length === 1 &&
    product.variants.edges[0].node.title === 'Default Title';

  return product ? (
    <View style={styles.container}>
      <View style={styles.detailsContainer}>
        {product.images.edges.length > 0 && (
          <Image
            source={{ uri: product.images.edges[0].node.src }}
            style={styles.image}
            resizeMode='contain'
          />
        )}

        <Text style={styles.productTitle}>{product.title}</Text>
        <Text style={styles.productTitle}>
          {product.priceRange.minVariantPrice.amount}
          {product.priceRange.minVariantPrice.currencyCode}
        </Text>
      </View>
      <View style={styles.ctaContainer}>
        <TouchableHighlight
          style={styles.openButton}
          onPress={() => {
            setBottomSheetVisible(true);
          }}
        >
          <Text style={styles.textStyle}>Details</Text>
        </TouchableHighlight>

        <Modal
          animationType='slide'
          transparent={true}
          visible={bottomSheetVisible}
          onRequestClose={() => {
            setBottomSheetVisible(false);
          }}
        >
          <View style={styles.bottomSheetWrapper}>
            <View style={styles.bottomSheet}>
              <Image
                source={{ uri: product.images.edges[0].node.src }}
                style={styles.modalImage}
                resizeMode='contain'
              />
              <Text style={styles.modalProductTitle}>{product.title}</Text>
              <Text style={styles.modalProductDescription}>
                {product.description}
              </Text>
              {hasOnlyDefaultVariant ? (
                <View style={styles.quantityContainer}>
                  <Text>
                    Price: {Number(selectedVariantPrice.amount).toFixed(2)}€
                  </Text>
                </View>
              ) : (
                <ProductVariants
                  selectedVariantId={selectedVariantId}
                  initialSelectedOptions={
                    product.variants.edges[0].node.selectedOptions
                  }
                  setSelectedVariantId={setSelectedVariantId}
                  productId={product.id}
                  initialPrice={product.variants.edges[0].node.price}
                  setSelectedVariantPrice={setSelectedVariantPrice}
                />
              )}
              <View style={styles.quantityContainer}>
                <Text style={{ marginRight: 10 }}>Quantity:</Text>
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
              <TouchableHighlight
                style={styles.closeButton}
                onPress={() => {
                  addToCart({
                    variantId: selectedVariantId,
                    quantity,
                    title: product.title,
                    price: Number(selectedVariantPrice.amount),
                    imageSrc: product.images.edges[0].node.src,
                  });
                  setBottomSheetVisible(false);
                }}
              >
                <Text style={styles.textStyle}>Add to cart</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.closeButton}
                onPress={() => {
                  setBottomSheetVisible(false);
                }}
              >
                <Text style={styles.textStyle}>Close</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  detailsContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    margin: 10,
  },
  ctaContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  image: {
    width: 50,
    height: 50,
  },
  modalImage: {
    width: 120,
    height: 120,
    alignSelf: 'center',
  },
  openButton: {
    backgroundColor: theme.colors.darkgold,
    borderRadius: 20,
    padding: 5,
    elevation: 2,
  },
  productTitle: {
    color: 'black',
    fontFamily: 'title',
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 1,
    marginLeft: 10,
  },
  textStyle: {
    color: 'black',
    fontFamily: 'regular',
    textAlign: 'center',
    fontSize: 12,
  },
  bottomSheetWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: 'white',
    padding: 16,
    height: screenHeight * 0.95, // Example height for bottom sheet
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeButton: {
    backgroundColor: theme.colors.darkgold,
    color: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  modalProductTitle: {
    textAlign: 'center',
    fontFamily: 'title',
    fontSize: 28,
    marginBottom: 15,
  },
  modalProductDescription: {
    textAlign: 'center',
    fontFamily: 'regular',
    marginBottom: 15,
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  quantityButton: {
    padding: 5,
    borderWidth: 1,
    borderColor: 'black',
    width: 30,
    alignItems: 'center',
  },
  quantity: {
    marginHorizontal: 10,
  },
});
