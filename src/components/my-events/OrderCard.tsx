import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import type { OrderNode } from '../../types';
import { useState } from 'react';

import OrderDetails from './OrderDetails';

type Props = {
  order: OrderNode;
};

const OrderCard = ({ order }: Props) => {
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const { customAttributes } = order;
  const eventDate = customAttributes.find(
    (attr) => attr.key === '_event_date'
  )?.value;
  const eventName = customAttributes.find(
    (attr) => attr.key === '_event_name'
  )?.value;
  const eventHandle = customAttributes.find(
    (attr) => attr.key === '_event_handle'
  )?.value;
  const orderIdentifier = customAttributes.find(
    (attr) => attr.key === 'order_identifier'
  )?.value;
  const venueMap = customAttributes.find(
    (attr) => attr.key === '_venue_map_url'
  )?.value;

  return (
    <>
      <Pressable onPress={() => setBottomSheetVisible(true)}>
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.description}>{eventDate}</Text>
            <Text style={styles.title}>{eventName}</Text>
            <Text style={styles.description}>
              {order.lineItems.edges.length} items
            </Text>
          </View>
          <View style={styles.detailsContainer}>
            <FontAwesome name='info-circle' size={24} color='black' />
            <Text style={styles.description}>Details</Text>
          </View>
        </View>
      </Pressable>
      {bottomSheetVisible &&
        eventName &&
        eventDate &&
        eventHandle &&
        venueMap &&
        orderIdentifier && (
          <OrderDetails
            order={order}
            eventDate={eventDate}
            eventName={eventName}
            eventHandle={eventHandle}
            venueMap={venueMap}
            bottomSheetVisible={bottomSheetVisible}
            orderIdentifier={orderIdentifier}
            setBottomSheetVisible={setBottomSheetVisible}
          />
        )}
    </>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    borderRadius: 4,
    marginBottom: 20,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  textContainer: {
    width: '70%',
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: 'title',
    marginBottom: 3,
  },
  description: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'regular',
  },
  detailsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});
