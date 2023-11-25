import { View, Text } from 'react-native';

import PickupLocation from './PickupLocation';

type Props = {
  locationIds: string[];
  setSelectedPickupLocation: (id: string) => void;
};

const PickupLocations = ({ locationIds, setSelectedPickupLocation }: Props) => {
  console.log(locationIds);
  return (
    <View>
      <Text>pickup locations</Text>
      {locationIds.map((id) => (
        <PickupLocation
          setSelectedPickupLocation={setSelectedPickupLocation}
          key={id}
          id={id}
        />
      ))}
    </View>
  );
};

export default PickupLocations;
