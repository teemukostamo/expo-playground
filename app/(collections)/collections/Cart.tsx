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
import { client } from '../../../client';
import theme from '../../../theme';
import { CartItem } from '../../../src/types';

const screenHeight = Dimensions.get('window').height;

type Props = {
  cart: CartItem[];
  event_name: string;
  event_date: string;
  event_handle: string;
  venue_map_url: string;
};

const Cart = ({
  cart,
  event_name,
  event_date,
  event_handle,
  venue_map_url,
}: Props) => {
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const handleBuyNow = async () => {
    try {
      const { data } = await client.mutate({
        mutation: CREATE_CHECKOUT,
        variables: {
          input: {
            lineItems: cart.map((item: any) => ({
              variantId: item.variantId,
              quantity: item.quantity,
            })),
            customAttributes: [
              {
                key: 'order_identifier',
                value: '1234',
              },
              {
                key: '_event_name',
                value: event_name,
              },
              {
                key: '_event_date',
                value: event_date,
              },
              {
                key: '_event_handle',
                value: event_handle,
              },
              {
                key: '_utm_source',
                value: 'direct',
              },
              {
                key: '_venue_map_url',
                value: venue_map_url,
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
      // clear cart
    } catch (error) {
      console.error(error);
      setBottomSheetVisible(false);
      router.push('/error');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight
        onPress={() => {
          setBottomSheetVisible(true);
        }}
      >
        <Text style={styles.openCartButton}>
          View {cart.length} items in cart
        </Text>
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
            <Text style={styles.modalText}>
              Your cart for {event_name} {event_date}:
            </Text>
            {cart.map((item: any) => (
              <Text key={item.variantId}>
                {item.title} x {item.quantity}
              </Text>
            ))}
            <TouchableHighlight
              style={styles.closeButton}
              onPress={() => {
                handleBuyNow();
              }}
            >
              <Text style={styles.textStyle}>Checkout</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.closeButton}
              onPress={() => {
                setBottomSheetVisible(false);
              }}
            >
              <Text style={styles.textStyle}>Continue Shopping</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Cart;

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
    backgroundColor: theme.colors.lightgold,
    padding: 10,
  },
  openCartButton: {
    color: 'white',
    fontFamily: 'regular',
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
    height: screenHeight * 0.95,
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
