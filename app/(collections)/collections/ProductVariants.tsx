import { gql, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { client } from '../../../client';

import theme from '../../../theme';
import LoadingIndicator from '../../../src/components/layout/LoadingIndicator';

type SelectedOptions = {
  name: string;
  value: string;
};

type InitialPrice = {
  currencyCode: string;
  amount: string;
};

type Props = {
  productId: string;
  selectedVariantId: string;
  setSelectedVariantId: (variantId: string) => void;
  initialSelectedOptions: SelectedOptions[];
  initialPrice: InitialPrice;
  setSelectedVariantPrice: (price: InitialPrice) => void;
};

type ProductOption = {
  name: string;
  id: string;
  values: string[];
};

const ProductVariants = ({
  productId,
  setSelectedVariantId,
  initialSelectedOptions,
  initialPrice,
  setSelectedVariantPrice,
}: Props) => {
  const [price, setPrice] = useState(initialPrice);
  const [selectedOptions, setSelectedOptions] = useState(
    initialSelectedOptions.map((option) => {
      return { name: option.name, value: option.value };
    })
  );
  const { loading, error, data } = useQuery(GET_PRODUCT_OPTIONS, {
    variables: { productId },
    client: client,
  });

  useEffect(() => {
    const fetchSelectedVariant = async () => {
      try {
        const { data } = await client.query({
          query: GET_SELECTED_VARIANT,
          variables: {
            productId,
            selectedOptions,
          },
        });

        if (data.product.variantBySelectedOptions) {
          setSelectedVariantId(data.product.variantBySelectedOptions.id);
          setPrice(data.product.variantBySelectedOptions.price);
          setSelectedVariantPrice(data.product.variantBySelectedOptions.price);
        }
      } catch (error) {
        console.error('Error fetching selected variant:', error);
      }
    };
    // Check if all options are selected
    fetchSelectedVariant();
    // if (Object.keys(selectedOptions).length === product.options.length) {
    //   // Trigger the query to get the selected variant

    // }
  }, [selectedOptions]);

  if (!productId || typeof productId !== 'string') {
    return null;
  }
  if (loading) return <LoadingIndicator />;
  if (error) {
    return <Text>Error! {error.message}</Text>;
  }
  const { product } = data;

  const handleOptionSelect = (optionName: string, value: string) => {
    // Find the index of the object with the matching name
    const index = selectedOptions.findIndex(
      (option) => option.name === optionName
    );

    let newSelectedOptions;
    if (index !== -1) {
      newSelectedOptions = [...selectedOptions];
      newSelectedOptions[index].value = value;
    } else {
      newSelectedOptions = [...selectedOptions, { name: optionName, value }];
    }

    setSelectedOptions(newSelectedOptions);
  };

  const isOptionSelected = (optionName: string, optionValue: string) => {
    return selectedOptions.some(
      (option) => option.name === optionName && option.value === optionValue
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.optionTitle}>Price</Text>
      <Text style={styles.optionTitle}>
        {price.amount}
        {price.currencyCode}
      </Text>
      {product.options.map((option: ProductOption) => {
        return (
          <View key={option.id}>
            <Text style={styles.optionTitle}>{option.name}</Text>
            <View style={styles.optionValuesContainer}>
              {option.values.map((value: string) => {
                const isSelected = isOptionSelected(option.name, value);
                return (
                  <TouchableOpacity
                    key={value}
                    onPress={() => {
                      handleOptionSelect(option.name, value);
                    }}
                    style={isSelected ? styles.selectedOption : null}
                  >
                    <Text
                      style={[
                        styles.optionValue,
                        isSelected ? styles.selectedOptionText : null,
                      ]}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default ProductVariants;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: 'title',
    padding: 10,
  },
  optionValuesContainer: {
    flexDirection: 'row',
  },
  optionValue: {
    fontFamily: 'regular',
    padding: 10,
  },
  selectedOption: {
    // Define styles for the selected option button
    color: theme.colors.darkblue,
    backgroundColor: theme.colors.lightgold,
    borderWidth: 1,
  },
  selectedOptionText: {
    // Define styles for the text of the selected option
    fontWeight: 'bold',
    color: theme.colors.darkblue,
  },
});

const GET_SELECTED_VARIANT = gql`
  query ProductVariants(
    $productId: ID!
    $selectedOptions: [SelectedOptionInput!]!
  ) {
    product(id: $productId) {
      id
      title
      options {
        id
        name
        values
      }
      variantBySelectedOptions(selectedOptions: $selectedOptions) {
        availableForSale
        compareAtPrice {
          amount
          currencyCode
        }
        price {
          amount
          currencyCode
        }
        id
        image {
          altText
          id
          url
        }
      }
    }
  }
`;

const GET_PRODUCT_OPTIONS = gql`
  query ProductVariants($productId: ID!) {
    product(id: $productId) {
      options {
        id
        name
        values
      }
    }
  }
`;
