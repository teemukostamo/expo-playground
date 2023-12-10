import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useQuery, gql } from '@apollo/client';
import { client } from '../../../client';
import { storeData, getData } from '../../../src/utils/AsyncStorageUtil';
import EventCard from './EventCard';
import ProductListing from './ProductListing';
import Cart from './Cart';
import {
  variantExists,
  removeCartItem,
  areCustomAttributesEqual,
} from '../../../src/utils/cartUtils';
import PickupOptions from './PickupOptions';

import type { CartItem } from '../../../src/types';
import LoadingIndicator from '../../../src/components/layout/LoadingIndicator';

type PickupOptionType = {
  integration: string;
  humanReadable: string;
} | null;

export default function Page() {
  const [cart, setCart] = useState<CartItem[] | null>(null);
  const [selectedPickupLocation, setSelectedPickupLocation] =
    useState<PickupOptionType>(null);
  const [selectedPickupTime, setSelectedPickupTime] =
    useState<PickupOptionType>(null);
  const local = useLocalSearchParams();
  const { loading, error, data } = useQuery(GET_COLLECTION, {
    variables: { handle: local.handle },
    client: client,
  });

  if (!local.handle || typeof local.handle !== 'string') {
    return null;
  }

  useEffect(() => {
    const loadCart = async () => {
      // vaihda tää collection.handle eikä local.handle?
      if (local.handle && typeof local.handle === 'string') {
        try {
          const storedCart = await getData(local.handle);
          if (storedCart && storedCart.length > 0) {
            setCart(storedCart);
            setSelectedPickupLocation({
              integration: storedCart[0].customAttributes[1].value,
              humanReadable: storedCart[0].customAttributes[0].value,
            });
            setSelectedPickupTime({
              integration: storedCart[0].customAttributes[3].value,
              humanReadable: storedCart[0].customAttributes[2].value,
            });
          } else {
            setCart([]);
          }
        } catch (error) {
          console.error('error getting cart', error);
        }
      }
    };

    loadCart();
  }, [local.handle]);

  useEffect(() => {
    const storeCart = async (handle: string, cart: CartItem[]) => {
      try {
        await storeData(handle, cart);
      } catch (error) {
        console.error('error setting cart', error);
      }
    };

    if (local.handle && typeof local.handle === 'string' && cart) {
      storeCart(local.handle, cart);
    }
  }, [cart]);

  const addToCart = (product: Omit<CartItem, 'customAttributes'>) => {
    if (cart && selectedPickupLocation && selectedPickupTime) {
      const productToAdd = {
        ...product,
        customAttributes: [
          {
            key: 'pickup_location_selection',
            value: selectedPickupLocation?.humanReadable,
          },
          {
            key: '_integration_pickup_location',
            value: selectedPickupLocation?.integration,
          },
          {
            key: 'pickup_time_selection',
            value: selectedPickupTime?.humanReadable,
          },
          {
            key: '_integration_pickup_time',
            value: selectedPickupTime?.integration,
          },
        ],
      };
      if (variantExists(cart, productToAdd)) {
        const updatedCart = cart.map((item) => {
          // include custom attributes in comparison
          if (item.variantId === product.variantId) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          } else {
            return item;
          }
        });
        setCart(updatedCart);
      } else {
        setCart([...cart, productToAdd]);
      }
    }
  };

  const incrementItemInCart = (item: CartItem) => {
    if (cart) {
      const updatedCart = cart.map((cartItem) => {
        if (
          cartItem.variantId === item.variantId &&
          areCustomAttributesEqual(
            cartItem.customAttributes,
            item.customAttributes
          )
        ) {
          return {
            ...cartItem,
            quantity: cartItem.quantity + 1,
          };
        } else {
          return cartItem;
        }
      });
      setCart(updatedCart);
    }
  };

  const decrementItemInCart = (item: CartItem) => {
    if (cart) {
      const updatedCart = cart.map((cartItem) => {
        if (
          cartItem.variantId === item.variantId &&
          areCustomAttributesEqual(
            cartItem.customAttributes,
            item.customAttributes
          )
        ) {
          return {
            ...cartItem,
            quantity: cartItem.quantity - 1,
          };
        } else {
          return cartItem;
        }
      });
      setCart(updatedCart);
    }
  };

  const removeItemFromCart = (item: CartItem) =>
    cart && setCart(removeCartItem(cart, item));

  if (loading) return <LoadingIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;

  if (!data) return <Text>No collection found.</Text>;

  const { collectionByHandle } = data;

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' ? null : <View style={{ height: 25 }} />}
      <EventCard collection={data.collectionByHandle} />
      {cart && (
        <PickupOptions
          initialModalVisible={cart.length === 0}
          setSelectedPickupTime={setSelectedPickupTime}
          setSelectedPickupLocation={setSelectedPickupLocation}
          selectedPickupLocation={selectedPickupLocation}
          selectedPickupTime={selectedPickupTime}
          locationids={JSON.parse(
            data.collectionByHandle.pickup_locations.value
          )}
          timeOptions={JSON.parse(data.collectionByHandle.pickup_times.value)}
        />
      )}

      {selectedPickupLocation !== null && selectedPickupTime !== null ? (
        <ProductListing
          products={filterProducts(
            collectionByHandle.products.edges,
            selectedPickupLocation.integration,
            selectedPickupTime.integration
          )}
          addToCart={addToCart}
        />
      ) : null}
      {cart !== null && cart.length > 0 ? (
        <Cart
          incrementItemInCart={incrementItemInCart}
          decrementItemInCart={decrementItemInCart}
          cart={cart}
          setCart={setCart}
          removeItemFromCart={removeItemFromCart}
          event_handle={collectionByHandle.handle}
          event_date={collectionByHandle.event_date.value}
          event_name={collectionByHandle.event_name.value}
          venue_map_url={collectionByHandle.venue_map_url.value}
        />
      ) : null}
    </View>
  );
}

function filterProducts(
  products: any,
  pickupLocation: string,
  pickupTime: string
) {
  return products.filter((product: any) => {
    // Check if the product's pickup_location includes the specified location
    const locationMatch =
      product.node.pickup_location_filter.value.includes(pickupLocation);

    // Parse pickup times and check if the specified time is included
    const timeMatch = JSON.parse(product.node.pickup_time_selection.value).some(
      (timeString: string) => {
        const [_, timeValue] = timeString.split('|').map((part) => part.trim());
        return timeValue === pickupTime;
      }
    );

    return locationMatch && timeMatch;
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'flex-start',
  },
});

export const GET_COLLECTION = gql`
  query CollectionByHandle($handle: String!) {
    collectionByHandle(handle: $handle) {
      id
      handle
      title
      pickup_locations: metafield(
        namespace: "custom"
        key: "pickup_locations"
      ) {
        value
      }
      pickup_times: metafield(namespace: "custom", key: "pickup_times") {
        value
      }
      image {
        src
        altText
      }
      event_date: metafield(namespace: "custom", key: "event_date") {
        value
      }
      event_name: metafield(namespace: "custom", key: "event_name") {
        value
      }
      venue_map_url: metafield(namespace: "custom", key: "venue_map") {
        value
      }
      products(first: 50) {
        edges {
          node {
            id
            description
            title
            handle
            productType
            pickup_location_filter: metafield(
              namespace: "custom"
              key: "pickup_location_filter"
            ) {
              value
            }
            pickup_location_selection: metafield(
              namespace: "custom"
              key: "pickup_location_selection"
            ) {
              value
            }
            pickup_time_selection: metafield(
              namespace: "custom"
              key: "pickup_time_selection"
            ) {
              value
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  selectedOptions {
                    name
                    value
                  }
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  src
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;
