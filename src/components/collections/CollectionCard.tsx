import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import theme from '../../../theme';

const CollectionCard = ({ collection }: any) => {
  const handlePress = () => {
    router.push(`/collections/${collection.handle}`);
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.container}>
        <ImageBackground
          source={{ uri: collection.image.src }}
          style={styles.backgroundImage}
          resizeMode='cover'
        >
          <View style={styles.overlay}>
            <Text style={styles.location}>
              {collection.venue_name.value}, {collection.city.value}
            </Text>
          </View>
        </ImageBackground>
        <View style={styles.eventContainer}>
          <View style={styles.eventTextContainer}>
            <Text style={styles.eventName}>{collection.event_name.value}</Text>
            <Text style={styles.eventDate}>{collection.event_date.value}</Text>
            {/* <Text style={styles.eventDate}>
                {collection.venue_name.value}, {collection.city.value}
              </Text> */}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default CollectionCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff', // Set background color
    // borderWidth: 1, // Set border width
    borderColor: '#ddd', // Set border color
    // borderRadius: 10, // Optional: if you want rounded corners
    shadowColor: theme.colors.darkgold, // Color of the shadow
    shadowOffset: {
      width: 0,
      height: 5, // Adjust the height for more or less elevation
    },
    shadowOpacity: 0.25, // Adjust the opacity for a more or less pronounced shadow
    shadowRadius: 3.84, // Blur radius of the shadow
    elevation: 5,
    borderRadius: 4,
    overflow: 'hidden',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    height: 160,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Adjust the alpha value for opacity
  },
  location: {
    color: theme.colors.lightgold,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    fontFamily: 'regular',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 10, // Optional: for padding around the text
    paddingVertical: 5,
  },
  eventContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'black',
    height: 70,
  },
  eventTextContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    backgroundColor: 'black',
    height: 60,
    margin: 10,
  },
  eventName: {
    color: theme.colors.lightgold,
    letterSpacing: 1,
    fontFamily: 'title',
    fontSize: 24,
    fontWeight: 'bold',
  },
  eventDate: {
    color: 'white',
    fontFamily: 'regular',
    fontSize: 14,
  },
});
