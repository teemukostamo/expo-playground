import React, { useContext, useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { router, usePathname } from 'expo-router';
import { gql } from '@apollo/client';
import { client } from '../../graphql/client';
import theme from '../../../theme';
import { CartItem as CartItemType } from '../../types';
import CartItem from './CartItem';
import Subtotal from './Subtotal';
import { getTotalItemsQuantity } from '../../utils/cartUtils';
import { AppContext } from '../../context/main';

const screenHeight = Dimensions.get('window').height;

type Props = {
  cart: CartItemType[];
  setCart: React.Dispatch<React.SetStateAction<CartItemType[] | null>>;
  removeItemFromCart: (item: CartItemType) => void;
  incrementItemInCart: (item: CartItemType) => void;
  decrementItemInCart: (item: CartItemType) => void;
  event_name: string;
  event_date: string;
  event_handle: string;
  venue_map_url: string;
};

const Cart = ({
  cart,
  setCart,
  removeItemFromCart,
  incrementItemInCart,
  decrementItemInCart,
  event_name,
  event_date,
  event_handle,
  venue_map_url,
}: Props) => {
  const { state } = useContext(AppContext);
  const path = usePathname();
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const scale = useSharedValue(1); // Initial scale is 1
  useEffect(() => {
    // Trigger the animation to grow and then shrink back
    scale.value = withSpring(1.2, {}, () => {
      scale.value = withSpring(1); // Shrink back to original size
    });
  }, [getTotalItemsQuantity(cart)]); // Depend on cart quantity
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  const handleCheckout = async () => {
    try {
      const { data: cartData } = await client.mutate({
        mutation: CREATE_CART,
        variables: {
          input: {
            buyerIdentity: {
              countryCode: 'FI',
              customerAccessToken: state.auth.token,
            },
            lines: cart.map((item: any) => ({
              merchandiseId: item.variantId,
              quantity: item.quantity,
              attributes: item.customAttributes,
            })),
            attributes: [
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
        params: {
          webUrl: cartData.cartCreate.cart.checkoutUrl,
          prevRoute: path,
        },
      });
      setCart([]);
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
        <Animated.Text style={[styles.openCartButton, animatedStyles]}>
          View {getTotalItemsQuantity(cart)} items in cart
        </Animated.Text>
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
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Product</Text>
              <Text style={styles.headerText}>Total</Text>
            </View>
            <ScrollView>
              {cart.map((item: CartItemType) => (
                <CartItem
                  incrementItemInCart={incrementItemInCart}
                  decrementItemInCart={decrementItemInCart}
                  removeItemFromCart={removeItemFromCart}
                  key={`${item.variantId}${JSON.stringify(
                    item.customAttributes
                  )}`}
                  item={item}
                />
              ))}
            </ScrollView>
            <Subtotal cart={cart} />
            <TouchableHighlight
              style={styles.closeButton}
              onPress={() => {
                handleCheckout();
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
            <TouchableHighlight
              style={styles.closeButton}
              onPress={() => {
                setBottomSheetVisible(false);
                setCart([]);
              }}
            >
              <Text style={styles.textStyle}>Clear cart</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Cart;

const CREATE_CART = gql`
  mutation cartCreate($input: CartInput) {
    cartCreate(input: $input) {
      cart {
        checkoutUrl
        id
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.lightgold,
    // padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    shadowColor: '#000', // Shadow Color
    shadowOffset: { width: 0, height: 2 }, // Shadow Offset
    shadowOpacity: 0.25, // Shadow Opacity
    shadowRadius: 3.84, // Shadow Radius
    elevation: 5, // Elevation for Android
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    textTransform: 'uppercase',
    fontFamily: 'regular',
    fontSize: 10,
    marginBottom: 5,
  },
  modalTriggerContainer: {
    marginHorizontal: 10,
    width: '80%',
    backgroundColor: 'red',
  },
  openCartButton: {
    color: 'white',
    fontFamily: 'title',
    textAlign: 'center', // Center the text
    paddingVertical: 10, // Padding for top and bottom to make it look substantial
    fontSize: 24, // Increase font size if needed
    fontWeight: 'bold', // Optional: if you want the text to be bold
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
    textAlign: 'left',
    fontFamily: 'title',
    marginBottom: 15,
  },
});
