import { View, Text, Pressable } from 'react-native';
import { useQuery, gql } from '@apollo/client';
import { client } from '../../client';

type Props = {
  id: string;
  setSelectedPickupLocation: (id: string) => void;
};

const PickupLocation = ({ id, setSelectedPickupLocation }: Props) => {
  const { loading, error, data } = useQuery(GET_PICKUP_LOCATION, {
    variables: { id },
    client: client,
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!data.metaobject.fields[0].value) return null;

  const pickupLocation = JSON.parse(data.metaobject.fields[0].value);

  return (
    <View>
      <Text>{pickupLocation.name}</Text>
      <Text>{pickupLocation.description}</Text>
      <Pressable onPress={() => setSelectedPickupLocation(pickupLocation.id)}>
        <Text>Select</Text>
      </Pressable>
    </View>
  );
};

export default PickupLocation;

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
