import type {
  ProductAttributeOptions,
  CartItem,
  CustomAttribute,
} from '../types';

export const parseProductAttributeOptions = (
  option: string
): ProductAttributeOptions => {
  const [humanReadable, integration] = option.split('|');
  return {
    humanReadable: humanReadable.trim(),
    integration: integration.trim(),
  };
};

export function variantExists(cart: CartItem[], product: CartItem) {
  return cart.some((cartItem: CartItem) => {
    return (
      cartItem.variantId === product.variantId &&
      areCustomAttributesEqual(
        cartItem.customAttributes,
        product.customAttributes
      )
    );
  });
}

export function removeCartItem(cart: CartItem[], itemToRemove: CartItem) {
  return cart.filter((cartItem) => {
    return !(
      cartItem.variantId === itemToRemove.variantId &&
      areCustomAttributesEqual(
        cartItem.customAttributes,
        itemToRemove.customAttributes
      )
    );
  });
}

export function findCartItem(
  cart: CartItem[],
  itemToFind: CartItem
): CartItem | undefined {
  return cart.find((cartItem) => {
    return (
      cartItem.variantId === itemToFind.variantId &&
      areCustomAttributesEqual(
        cartItem.customAttributes,
        itemToFind.customAttributes
      )
    );
  });
}

export function areCustomAttributesEqual(
  attributes1: CustomAttribute[],
  attributes2: CustomAttribute[]
) {
  if (attributes1.length !== attributes2.length) return false;

  return attributes1.every((attr1) => {
    const attr2 = attributes2.find((attr2) => attr1.key === attr2.key);
    return attr2 && attr1.value === attr2.value;
  });
}

export const getTotalItemsQuantity = (cart: CartItem[]) => {
  return cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
};
