import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen({ navigation }) {
  const [location, setLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const userStyles = [
    {
      featureType: 'road',
      elementType: 'geometry',
    },
  ];

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg("Permission to access location was denied, you can re-activate this on the app's settings.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let initialRegion = {
    latitude: location ? location.coords.latitude : 40.9819,
    longitude: location ? location.coords.longitude : 28.7178,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        enableUserRenderer={true}
        userProvidedStyles={userStyles}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 10,
  },
  overlayText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
