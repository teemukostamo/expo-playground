import {
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  ScrollView,
  Pressable,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { OrderNode, LineItemNode } from '../../../src/types';
import OrderLineItem from './OrderLineItem';
import theme from '../../../theme';
import VenueMap from './VenueMap';

type Props = {
  order: OrderNode;
  eventName: string;
  eventDate: string;
  eventHandle: string;
  venueMap: string;
  orderIdentifier: string;
  bottomSheetVisible: boolean;
  setBottomSheetVisible: React.Dispatch<React.SetStateAction<boolean>>;
};
const screenHeight = Dimensions.get('window').height;

const OrderDetails = ({
  order,
  bottomSheetVisible,
  setBottomSheetVisible,
  venueMap,
  eventName,
  eventDate,
  orderIdentifier,
}: Props) => {
  console.log('order at orderDetails', order);
  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={bottomSheetVisible}
      onRequestClose={() => {
        setBottomSheetVisible(false);
      }}
    >
      <View style={styles.bottomSheetWrapper}>
        <View style={styles.bottomSheet}>
          <View style={styles.eventDetailsContainer}>
            <View>
              <Text style={styles.eventDetailsText}>
                {eventName} {eventDate}
              </Text>
              <Text style={styles.eventDetailsText}>{order.name}</Text>
              <Text style={styles.eventDetailsText}>{orderIdentifier}</Text>
            </View>
            <Pressable onPress={() => setBottomSheetVisible(false)}>
              <FontAwesome name='close' size={24} color='black' />
            </Pressable>
          </View>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Product</Text>
            <Text style={styles.headerText}>Total</Text>
          </View>
          <ScrollView>
            {order.lineItems.edges.map(
              (item: { node: LineItemNode }, index: number) => (
                <OrderLineItem
                  node={item.node}
                  key={`${item.node.variant.id}-${index}`}
                />
              )
            )}
          </ScrollView>
          {/* <Subtotal cart={cart} /> */}
          <VenueMap imageSrc={venueMap} />
        </View>
      </View>
    </Modal>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.lightgold,
    padding: 10,
  },
  eventDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventDetailsTextContainer: {
    fontFamily: 'title',
    color: '#333',
    fontSize: 16,
  },
  eventDetailsText: {
    fontFamily: 'title',
    color: '#333',
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    textTransform: 'uppercase',
    fontFamily: 'regular',
    fontSize: 10,
    marginBottom: 5,
  },
  openCartButton: {
    color: 'white',
    fontFamily: 'regular',
  },
  textStyle: {
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomSheetWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: 'white',
    padding: 16,
    height: screenHeight * 0.95,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  modalText: {
    textAlign: 'left',
    fontFamily: 'title',
    marginBottom: 15,
  },
});
