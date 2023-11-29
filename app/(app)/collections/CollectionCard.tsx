import { View, StyleSheet, Image, Text, ImageBackground } from 'react-native';
import { Link } from 'expo-router';
import theme from '../../../theme';

const CollectionCard = ({ collection }: any) => {
  return (
    <ImageBackground
      source={{ uri: collection.image.src }}
      style={styles.backgroundImage}
      resizeMode='cover'
    >
      <View style={styles.overlay}>
        <Link
          href={{
            pathname: '/collections/[handle]',
            params: { handle: collection.handle },
          }}
        >
          <Text style={styles.title}>{collection.title}</Text>
        </Link>
      </View>
    </ImageBackground>
  );
};

export default CollectionCard;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    margin: 10,
  },
  overlay: {
    flex: 1,
    height: 140,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Adjust the alpha value for opacity
  },
  title: {
    color: theme.colors.lightgold,
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
  },
});
