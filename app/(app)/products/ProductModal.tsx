import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { gql } from '@apollo/client';
import type { CartItem } from '../../../src/types';
import theme from '../../../theme';

type Props = {
  addToCart: (product: CartItem) => void;
  product: {
    title: string;
    description: string;
    variants: any;
    images: any;
  };
};

const screenHeight = Dimensions.get('window').height;

export default function ProductModal({ product, addToCart }: Props) {
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

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
              <Text style={styles.modalText}>{product.title}</Text>
              <Text style={styles.modalText}>{product.description}</Text>
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
        <TouchableHighlight
          style={styles.openButton}
          onPress={() => {
            addToCart({
              variantId: product.variants.edges[0].node.id,
              quantity: 1,
              title: product.title,
              price: 10,
            });
          }}
        >
          <Text style={styles.textStyle}>Add to cart</Text>
        </TouchableHighlight>
      </View>
    </View>
  ) : null;
}

const CREATE_CHECKOUT = gql`
  mutation checkoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        webUrl
        lineItems(first: 5) {
          edges {
            node {
              title
              quantity
            }
          }
        }
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 20,
  },
  detailsContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'white',
    padding: 10,
    margin: 5,
  },
  ctaContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  image: {
    width: 80,
    height: 80,
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
    fontSize: 18,
    letterSpacing: 1,
    marginLeft: 10,
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'regular',
    textAlign: 'center',
    fontSize: 16,
  },
  bottomSheetWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: 'white',
    padding: 16,
    height: screenHeight * 0.4, // Example height for bottom sheet
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
  modalText: {
    textAlign: 'center',
    marginBottom: 15,
  },
});
