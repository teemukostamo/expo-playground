import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { gql } from '@apollo/client';
import { client } from '../../client';
import type { CartItem } from '../../src/types';

type Props = {
  addToCart: (product: CartItem) => void;
  product: {
    title: string;
    description: string;
    variants: any;
  };
};

const screenHeight = Dimensions.get('window').height;

export default function ProductModal({ product, addToCart }: Props) {
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const handleBuyNow = async () => {
    try {
      const { data } = await client.mutate({
        mutation: CREATE_CHECKOUT,
        variables: {
          input: {
            lineItems: [
              {
                variantId: product.variants.edges[0].node.id,
                quantity: 1,
              },
            ],
          },
        },
      });
      setBottomSheetVisible(false);
      router.push({
        pathname: '/checkout',
        params: { webUrl: data.checkoutCreate.checkout.webUrl },
      });
    } catch (error) {
      console.log(error);
      setBottomSheetVisible(false);
      router.push('/error');
    }
  };

  return (
    <View style={styles.container}>
      <Text>{product.title}</Text>
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
                handleBuyNow();
              }}
            >
              <Text style={styles.textStyle}>Add to order</Text>
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
  );
}

export const CREATE_CHECKOUT = gql`
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
    backgroundColor: '#2196F3',
    padding: 20,
    margin: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
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
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 15,
  },
});
