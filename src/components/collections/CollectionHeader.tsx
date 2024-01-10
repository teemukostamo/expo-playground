import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Pressable,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import theme from '../../../theme';
import { router } from 'expo-router';

const CollectionHeader = ({ collection }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.backButton}>
        <Pressable onPress={() => router.replace('/collections')}>
          <FontAwesome name='arrow-left' size={20} color='black' />
        </Pressable>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{collection.event_name.value}</Text>
        <Text style={styles.description}>
          Select pickup location, pickup time and products
        </Text>
      </View>
    </View>
  );
};

export default CollectionHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flexDirection: 'row',
  },
  backButton: {
    padding: 10,
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 10,
  },
  image: {
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    flex: 1,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    color: theme.colors.lightgold,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: 'rgba(0,0,0,0.5)',
    fontFamily: 'title',
    marginLeft: 10,
    letterSpacing: 1,
  },
  description: {
    color: theme.colors.lightgold,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: 'rgba(0,0,0,0.5)',
    fontFamily: 'regular',
    marginLeft: 10,
    letterSpacing: 1,
  },
});
