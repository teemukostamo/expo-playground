import { gql, useQuery } from '@apollo/client';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { client } from '../../../client';

type PickupOptionType = {
  integration: string;
  humanReadable: string;
};

type Props = {
  setSelectedPickupTime: (selection: PickupOptionType) => void;
  setSelectedPickupLocation: (selection: PickupOptionType) => void;
  selectedPickupTime: PickupOptionType | null;
  selectedPickupLocation: PickupOptionType | null;
  locationids: string[];
  timeOptions: string[];
  initialModalVisible: boolean;
};

const PickupOptions = ({
  setSelectedPickupTime,
  setSelectedPickupLocation,
  selectedPickupLocation,
  selectedPickupTime,
  locationids,
  timeOptions,
  initialModalVisible,
}: Props) => {
  const [step, setStep] = useState(1);
  const [modalVisible, setModalVisible] = useState(initialModalVisible);
  const { loading, error, data } = useQuery(GET_PICKUP_LOCATIONS, {
    variables: { ids: locationids },
    client: client,
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error</Text>;

  const handleOptionSelect = (integration: string, humanReadable: string) => {
    if (step === 2) {
      setSelectedPickupTime({ integration, humanReadable });
      setModalVisible(false); // Close the modal on the final step
    } else {
      setSelectedPickupLocation({ integration, humanReadable });
      setStep(step + 1);
    }
    // Call the selection handler from the parent component if needed
    // onSelection();
  };

  return (
    <>
      <View>
        {selectedPickupLocation && selectedPickupTime && (
          <>
            <Text>
              Showing products for {selectedPickupLocation.humanReadable},
              {selectedPickupTime.humanReadable}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setModalVisible(true);
                setStep(1);
              }}
            >
              <Text>Change selection</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <Modal visible={modalVisible} animationType='slide' transparent={false}>
        <View style={styles.container}>
          {step === 1 && (
            <View>
              <Text style={styles.text}>
                Welcome to this page. Please make a selection.
              </Text>
              {data.nodes.map((node: any) => {
                const data = JSON.parse(node.fields[0].value);
                return (
                  <View key={data.id}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => handleOptionSelect(data.id, data.name)}
                    >
                      <Text>{data.name}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
          {step === 2 && (
            <View>
              <Text style={styles.text}>Please make another selection.</Text>

              {timeOptions.map((option: string) => {
                const optionData = parsePipeSeparatedString(option);
                return (
                  <View key={optionData.key}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() =>
                        handleOptionSelect(optionData.key, optionData.value)
                      }
                    >
                      <Text>{optionData.value}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </Modal>
    </>
  );
};

function parsePipeSeparatedString(str: string) {
  const parts = str.split('|').map((part) => part.trim());
  return {
    key: parts[1],
    value: parts[0],
  };
}

const GET_PICKUP_LOCATIONS = gql`
  query pickupLocations($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Metaobject {
        id
        fields {
          key
          type
          value
        }
      }
    }
  }
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
});

export default PickupOptions;
