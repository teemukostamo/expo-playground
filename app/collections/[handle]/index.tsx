import { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { useQuery, gql } from '@apollo/client';
import { client } from '../../../client';
import { storeData, getData } from '../../../src/utils/AsyncStorageUtil';
import ProductModal from '../../products/ProductModal';
import PickupLocations from '../PickupLocations';
import ProductListing from '../ProductListing';

interface CartItem {
  variantId: string; // Unique identifier for the item, often the product variant ID
  title: string; // Title of the product
  variantTitle?: string; // Title of the variant, if applicable
  price: number; // Price of the item
  quantity: number; // Quantity of this item in the cart
  imageSrc?: string; // URL of the item's image
  // Add any other relevant fields, like size, color, etc.
}

export default function Page() {
  const [selectedPickupLocation, setSelectedPickupLocation] =
    useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const local = useLocalSearchParams();
  const { loading, error, data } = useQuery(GET_COLLECTION, {
    variables: { handle: local.handle },
    client: client,
  });

  if (!local.handle || typeof local.handle !== 'string') {
    return null;
  }
  console.log('cart state', cart);

  useEffect(() => {
    const loadCart = async () => {
      // vaihda tää collection.handle eikä local.handle
      if (local.handle && typeof local.handle === 'string') {
        console.log('getting itme with', local.handle);
        try {
          const storedCart = await getData(local.handle);
          if (storedCart && storedCart.length > 0) {
            setCart(storedCart);
          }
        } catch (error) {
          console.log('error getting cart', error);
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
        console.log('error setting cart', error);
      }
    };

    if (local.handle && typeof local.handle === 'string') {
      storeCart(local.handle, cart);
    }
  }, [cart]);

  const addToCart = (product: CartItem) => {
    setCart([...cart, product]);
  };

  if (loading)
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  if (error) return <Text>Error: {error.message}</Text>;

  if (!data) return <Text>No collection found.</Text>;

  return (
    <View style={styles.container}>
      <Text>{data.collectionByHandle.title}</Text>
      <PickupLocations
        locationIds={JSON.parse(data.collectionByHandle.pickup_locations.value)}
        setSelectedPickupLocation={setSelectedPickupLocation}
      />
      <ProductListing
        pickupLocation={selectedPickupLocation}
        collectionHandle={data.collectionByHandle.handle}
        products={data.collectionByHandle.products.edges}
        addToCart={addToCart}
      />
      {/* <FlatList
        data={data.collectionByHandle.products.edges}
        keyExtractor={({ node }) => node.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <ProductModal addToCart={addToCart} product={item.node} />
          </View>
        )}
      /> */}
      <Text>Cart: {cart.length}</Text>
      <Button onPress={() => router.back()} title='Go back' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export const GET_COLLECTION = gql`
  query CollectionByHandle($handle: String!) {
    collectionByHandle(handle: $handle) {
      id
      handle
      title
      description
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
