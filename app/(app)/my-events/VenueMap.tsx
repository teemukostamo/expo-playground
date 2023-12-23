import { View, Image, Text, StyleSheet } from 'react-native';

const VenueMap = ({ imageSrc }: { imageSrc: string }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pickup Location</Text>
      <Text>
        Pickup Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem
        impedit laborum repellat incidunt iste voluptatem repellendus
        asperiores. Dolorem, quaerat voluptates distinctio aliquam soluta cumque
        eaque temporibus quia quam reiciendis nesciunt.
      </Text>
      <Text style={styles.title}>Venue Map</Text>
      <Image source={{ uri: imageSrc }} style={styles.image} />
    </View>
  );
};

export default VenueMap;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
  },
  title: {
    fontFamily: 'title',
    fontSize: 20,
  },
});
