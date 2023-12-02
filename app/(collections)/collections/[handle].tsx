import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';

import { useQuery, gql } from '@apollo/client';
import { client } from '../../../client';
import { storeData, getData } from '../../../src/utils/AsyncStorageUtil';
import EventCard from './EventCard';
import PickupLocations from './PickupLocations';
import ProductListing from './ProductListing';
import Cart from './Cart';
import { variantExists, removeCartItem } from '../../../src/utils/cartUtils';
import type { CustomAttribute } from '../../../src/types';

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

export default function Page() {
  const [selectedPickupLocation, setSelectedPickupLocation] =
    useState<string>('');
  const [selectedPickupTime, setSelectedPickupTime] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
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

    if (local.handle && typeof local.handle === 'string') {
      storeCart(local.handle, cart);
    }
  }, [cart]);

  const addToCart = (product: CartItem) => {
    if (variantExists(cart, product)) {
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
      setCart([...cart, product]);
    }
  };

  const removeItemFromCart = (item: CartItem) =>
    setCart(removeCartItem(cart, item));

  if (loading)
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  if (error) return <Text>Error: {error.message}</Text>;

  if (!data) return <Text>No collection found.</Text>;

  const { collectionByHandle } = data;

  return (
    <View style={styles.container}>
      <EventCard collection={data.collectionByHandle} />
      <PickupLocations
        locationIds={JSON.parse(data.collectionByHandle.pickup_locations.value)}
        setSelectedPickupLocation={setSelectedPickupLocation}
        selectedPickupLocation={selectedPickupLocation}
      />
      <ProductListing
        pickupLocation={selectedPickupLocation}
        products={data.collectionByHandle.products.edges}
        addToCart={addToCart}
      />
      {cart && cart.length > 0 ? (
        <Cart
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
