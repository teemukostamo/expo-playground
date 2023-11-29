import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { useQuery, gql } from '@apollo/client';
import { Ionicons } from '@expo/vector-icons';
import { client } from '../../../client';
import theme from '../../../theme';
import { useState } from 'react';

type Props = {
  id: string;
  setSelectedPickupLocation: (id: string) => void;
  selectedPickupLocation: string;
};

const PickupLocation = ({
  id,
  setSelectedPickupLocation,
  selectedPickupLocation,
}: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { loading, error, data } = useQuery(GET_PICKUP_LOCATION, {
    variables: { id },
    client: client,
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!data.metaobject.fields[0].value) return null;

  const pickupLocation = JSON.parse(data.metaobject.fields[0].value);

  return (
    <>
      {/* <Pressable onPress={() => setSelectedPickupLocation(pickupLocation.id)}> */}
      <Pressable onPress={() => setModalVisible(true)}>
        <View
          style={[
            styles.itemContainer,
            pickupLocation.id === selectedPickupLocation &&
              styles.selectedItemContainer,
          ]}
        >
          <Text style={styles.itemTitle}>{pickupLocation.name}</Text>
          {/* <Text style={styles.text}>{pickupLocation.description}</Text> */}
          <Ionicons name='information-circle-outline' size={24} color='black' />
        </View>
      </Pressable>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>
              Pickup location {pickupLocation.name} has{' '}
              {pickupLocation.description}
            </Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
                setSelectedPickupLocation(pickupLocation.id);
              }}
            >
              <Text>Order from {pickupLocation.name}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default PickupLocation;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    color: 'white',
  },
  selectButton: {
    color: theme.colors.lightgold,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 5,
    marginVertical: 10,
    padding: 4,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  selectedItemContainer: {
    backgroundColor: theme.colors.lightgold,
  },
  itemTitle: {
    marginRight: 10,
    fontSize: 16,
    fontFamily: 'regular',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
});

const GET_PICKUP_LOCATION = gql`
  query pickupLocation($id: ID!) {
    metaobject(id: $id) {
      id
      fields {
        key
        type
        value
      }
    }
  }
`;
