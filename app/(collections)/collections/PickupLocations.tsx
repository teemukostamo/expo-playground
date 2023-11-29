import { View, Text, FlatList } from 'react-native';

import PickupLocation from './PickupLocation';

type Props = {
  locationIds: string[];
  setSelectedPickupLocation: (id: string) => void;
  selectedPickupLocation: string;
};

const PickupLocations = ({
  locationIds,
  selectedPickupLocation,
  setSelectedPickupLocation,
}: Props) => {
  return (
    <View>
      {/* <Text>What can we get you?</Text>
      {locationIds.map((id) => (
        <PickupLocation
          setSelectedPickupLocation={setSelectedPickupLocation}
          key={id}
          id={id}
        />
        
      ))} */}
      <FlatList
        data={locationIds}
        renderItem={({ item }) => (
          <PickupLocation
            setSelectedPickupLocation={setSelectedPickupLocation}
            selectedPickupLocation={selectedPickupLocation}
            key={item}
            id={item}
          />
        )}
        keyExtractor={(item) => item}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default PickupLocations;
