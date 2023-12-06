import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import { CartItem as CartItemType } from '../../../src/types';

import theme from '../../../theme';
import CartCustomAttributes from './CartCustomAttributes';

type Props = {
  item: CartItemType;
  incrementItemInCart: (item: CartItemType) => void;
  decrementItemInCart: (item: CartItemType) => void;
  removeItemFromCart: (item: CartItemType) => void;
};

const CartItem = ({
  item,
  removeItemFromCart,
  incrementItemInCart,
  decrementItemInCart,
}: Props) => {
  const opacity = useSharedValue(1);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const handleRemove = (item: CartItemType) => {
    opacity.value = withTiming(0, { duration: 500 }, () => {
      runOnJS(removeItemFromCart)(item);
    });
  };

  return (
    <Animated.View style={[styles.container, animatedStyles]}>
      <Image source={{ uri: item.imageSrc }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.title}>
          €{(item.quantity * item.price).toFixed(2)}
        </Text>
        {item.variantTitle && (
          <Text style={styles.variantTitle}>{item.variantTitle}</Text>
        )}
        <CartCustomAttributes customAttributes={item.customAttributes} />
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => decrementItemInCart(item)}
            style={styles.quantityButton}
            disabled={item.quantity === 1}
          >
            <Text>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => incrementItemInCart(item)}
            style={styles.quantityButton}
          >
            <Text>+</Text>
          </TouchableOpacity>
          <Pressable
            style={{ marginLeft: 10 }}
            onPress={() => handleRemove(item)}
          >
            <FontAwesome
              name='trash-o'
              size={30}
              color={theme.colors.darkgold}
            />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontFamily: 'title',
  },
  variantTitle: {
    color: 'gray',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
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

export default CartItem;
