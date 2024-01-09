import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { CustomAttribute } from '../../types';

type Props = {
  customAttributes: CustomAttribute[];
};

const attributeNames: {
  [key: string]: string;
} = {
  pickup_location_selection: 'Pickup Location',
  pickup_time_selection: 'Pickup Time',
};

const CartCustomAttributes = ({ customAttributes }: Props) => {
  return customAttributes ? (
    <View style={styles.attributesContainer}>
      {customAttributes
        .filter((attr) => !attr.key.startsWith('_'))
        .map((attr) => (
          <View key={attr.key}>
            <Text style={styles.attributeKey}>{attributeNames[attr.key]}:</Text>
            <Text style={styles.attributeValue}>{attr.value}</Text>
          </View>
        ))}
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  attributesContainer: {
    // Styling for the container
    marginVertical: 5,
  },
  attributeContainer: {
    flexDirection: 'column',
  },
  attributeKey: {
    // Styling for the attribute text
    fontSize: 10,
    color: 'gray',
    textTransform: 'uppercase',
  },
  attributeValue: {
    // Styling for the attribute text
    fontSize: 12,
    color: 'black',
  },
});

export default CartCustomAttributes;
