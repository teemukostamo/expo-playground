import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { client } from '../../../client';
import theme from '../../../theme';

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
  };

  return (
    <>
      {selectedPickupLocation && selectedPickupTime && (
        <View style={styles.selectedOptionsContainer}>
          <Text style={{ color: 'white' }}>
            Showing products for {selectedPickupLocation.humanReadable},{' '}
            {selectedPickupTime.humanReadable}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setModalVisible(true);
              setStep(1);
            }}
          >
            <Text style={styles.buttonText}>Change selection</Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal visible={modalVisible} animationType='slide' transparent={false}>
        <View style={styles.container}>
          {step === 1 && (
            <View>
              <Text style={styles.text}>Please select a pickup location:</Text>
              {data.nodes.map((node: any) => {
                const data = JSON.parse(node.fields[0].value);
                return (
                  <View key={data.id}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => handleOptionSelect(data.id, data.name)}
                    >
                      <Text style={styles.buttonText}>{data.name}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
          {step === 2 && (
            <View>
              <Text style={styles.text}>Please select a pickup time:</Text>

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
                      <Text style={styles.buttonText}>{optionData.value}</Text>
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
    fontSize: 14,
    marginBottom: 20,
    fontFamily: 'regular',
  },
  button: {
    backgroundColor: theme.colors.darkgold,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'regular',
  },
  selectedOptionsContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
});

export default PickupOptions;
