import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Linking, TouchableWithoutFeedback } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [estimatedDistance, setEstimatedDistance] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [destinationSelected, setDestinationSeleceted] = useState(false);
  const GOOGLE_MAPS_API_KEY = 'AIzaSyDkk9xmxjAS0BMU9ym4_e6LTdBlArakEnI'; // Google Maps API anahtarınızı buraya ekleyin

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("Permission to access location was denied, you can re-activate this on the app's settings.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleMarkerPress = async (coordinate) => {
    setDestination(coordinate);
    setRouteCoordinates([]);
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${location.coords.latitude},${location.coords.longitude}&destination=${coordinate.latitude},${coordinate.longitude}&key=${GOOGLE_MAPS_API_KEY}`);
      const data = await response.json();
      const points = decodePolyline(data.routes[0].overview_polyline.points);
      setRouteCoordinates(points);
      const time = data.routes[0].legs[0].duration.text;
      setEstimatedTime(time);
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
    setDestinationSeleceted(true);
  };

  const decodePolyline = (encoded) => {
    let points = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = (result & 1) !== 0 ? ~(result >> 1) : (result >> 1);
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = (result & 1) !== 0 ? ~(result >> 1) : (result >> 1);
      lng += dlng;

      points.push({ latitude: lat / 1E5, longitude: lng / 1E5 });
    }
    return points;
  };

  //this code decodes polylines coming from Google Maps API and implements into my map. 
  //

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
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {destination && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="darkseagreen"
            strokeWidth={4}
          />
        )}
        <Marker
          coordinate={{ latitude: 41.0055, longitude: 28.9769 }}
          title="Blue Mosque"
          onPress={() => handleMarkerPress({ latitude: 41.0055, longitude: 28.9769 })}
        />
        <Marker
          coordinate={{ latitude: 41.04654252347306, longitude: 29.03422380818258 }}
          title="Bosphorus"
          onPress={() => handleMarkerPress({ latitude: 41.04654252347306, longitude: 29.03422380818258 })}
        />
        <Marker
          coordinate={{ latitude: 41.0115, longitude: 28.9814 }}
          title="Topkapı Palace"
          onPress={() => handleMarkerPress({ latitude: 41.0115, longitude: 28.9814 })}
        />
        <Marker
          coordinate={{ latitude: 41.0283, longitude: 28.9731 }}
          title="Istiklal Avenue"
          onPress={() => handleMarkerPress({ latitude: 41.0283, longitude: 28.9731 })}
        />
      </MapView>
      <TouchableOpacity
        style={styles.goButton}
        onPress={() => handleMarkerPress(destination)}
      >
        <Text style={styles.goButtonText}>How can I go?</Text>
      </TouchableOpacity>
      <Modal
      animationType='fade'
      transparent= {true}
      visible = {estimatedTime !== null}
      onRequestClose={() => setEstimatedTime(null)}>
        <TouchableWithoutFeedback onPress={() => {setEstimatedTime(null)
        setRouteCoordinates([]);
        setEstimatedTime(null);
      setDestinationSeleceted(false);}}>
        <View style = {styles.centeredView}>
          <View style = {styles.modalView}>
              <Text style = {styles.modalText}>Estimated time: {estimatedTime}</Text>
              <View
              style = {{flexDirection : "row", flex: 1}}>
              <TouchableOpacity
                style = {styles.closeButton}
                onPress= {() => {
                  setEstimatedTime(null);
                setRouteCoordinates([]);
              setEstimatedTime(null);
            setDestinationSeleceted(false);}}
              >
                <Text style = {styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => {
                  if (destination) {
                    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}`);
                  }
                }}
              >
                <Text style={styles.startButtonText}>Go</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
            style = {styles.localGuideButton}
            onPress={console.log("rehbertusuna bastin anani sikeyim senin")}>
          <Text style = {{fontFamily: "monospace", color: "white", fontWeight: "bold", fontSize: 16}}>rehbertusu</Text>
        </TouchableOpacity>
        </View>
        </TouchableWithoutFeedback>
        
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  goButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'darkseagreen',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  goButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: "monospace"
  },
  centeredView: {
    flex: 1,
    justifyContent: "top",
    alignItems: "center",
    marginTop: 60
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 20,
    position: "absolute",
    width: "80%",
    height: 130

  },
  modalText: {
    marginBottom: 15,
    textAlign: "left",
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: "monospace",
   
  },
  closeButton: {
    backgroundColor: 'darkseagreen',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop:10,
    marginLeft:62,
    width: "%48",
    position: "absolute",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: "monospace"
  },
  startButton: {
    backgroundColor: 'darkseagreen',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 152,
    marginTop:65,
    width: "%48",
    position: "absolute",
    alignSelf:"baseline"
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: "monospace"
  },
  localGuideButton: {
    backgroundColor: "darkseagreen",
    position: "absolute",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 84,
    marginLeft:48,
    justifyContent: "center",
    alignSelf:"baseline"

    //textseyleriyukarda
  },
});
