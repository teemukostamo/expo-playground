import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { CustomAttribute } from '../../../src/types';

type Props = {
  customAttributes: CustomAttribute[];
};

const CartCustomAttributes = ({ customAttributes }: Props) => {
  return (
    <View style={styles.attributesContainer}>
      {customAttributes
        .filter((attr) => !attr.key.startsWith('_'))
        .map((attr, index) => (
          <Text key={index} style={styles.attributeText}>
            {`${attr.key}: ${attr.value}`}
          </Text>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  attributesContainer: {
    // Styling for the container
    marginVertical: 5,
  },
  attributeText: {
    // Styling for the attribute text
    fontSize: 14,
    color: 'gray',
  },
});

export default CartCustomAttributes;
