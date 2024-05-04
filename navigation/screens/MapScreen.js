import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Linking, TouchableWithoutFeedback, Alert, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline, Callout } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import BosphorusIcon from "./../../icons/bosphorus.png"


export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [destinationSelected, setDestinationSeleceted] = useState(false);
  const [viewedMarker, setViewedMarker] = useState(null); 
  const [viewStartTime, setViewStartTime] = useState(null); 
  const [selectedName, setSelectedName] = useState(null);
  const [markers, setMarkers] = useState([
    { id: 1, title: "Blue Mosque", coordinate: { latitude: 41.0055, longitude: 28.9769 }, imageUri: 'https://trthaberstatic.cdn.wp.trt.com.tr/resimler/2032000/sultanahmet-camii-aa-2033022.jpg' },
    { id: 2, title: "Bosphorus", coordinate: { latitude: 41.04654252347306, longitude: 29.03422380818258 }, imageUri: 'https://lh5.googleusercontent.com/proxy/w2dEY4MpQOYKVXAMSXXdG44ETq4Ac4aAO8cR0n2UQQQ01kSIJujFPIRcghHnSUBt2MbZ2Dg-qLFd7zwk0ab9FWmcfrsrEELWh5ckqX7agE7tLElhck-Ip45YOcrFeoPmFsfmSA' },
    { id: 3, title: "Topkapı Palace", coordinate: { latitude: 41.0115, longitude: 28.9814 }, imageUri: 'https://istanbultarihi.ist/assets/uploads/files/cilt-8/topkapi-sarayi/3-topkapi-sarayi-gulhane-tarafindan.jpg' },
    { id: 4, title: "Istiklal Avenue", coordinate: { latitude: 41.0283, longitude: 28.9731 }, imageUri: null },
    { id: 5, title: "Technical University of Sofia", coordinate: { latitude: 42.65714634396518, longitude: 23.355303595910726 }, imageUri: null },
    { id: 6, title: "Avcilar Baris Manco Culture Center", coordinate: { latitude: 40.980239681936496, longitude: 28.72036129984934 }, imageUri: null },
  ]);

  const GOOGLE_MAPS_API_KEY = 'AIzaSyDkk9xmxjAS0BMU9ym4_e6LTdBlArakEnI'; // Google Maps API anahtarınızı buraya ekleyin
  const screenRoute = useRoute();

  const handleCalloutPress = (title) => {
    setSelectedName(title);
    console.log(title);
  }

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

  const handleMarkerPress = async (coordinate,title) => {
    if (!location) {
      console.log("Location is not available yet.");
      return;
    }
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

  const isMarkerVisible = (markerCoordinate, currentLocation, maxDistance) => {
    if (!currentLocation || !markerCoordinate) {
      return false;
    }
    const { latitude: markerLat, longitude: markerLng } = markerCoordinate;
    const { latitude: currentLat, longitude: currentLng } = currentLocation.coords;
    const distance = Math.sqrt(Math.pow(markerLat - currentLat, 2) + Math.pow(markerLng - currentLng, 2)) * 111000; // 1 derece = 111km
    return distance <= maxDistance;
  };

  useEffect(() => {
    const checkNearbyMarkers = () => {
      markers.forEach(marker => {
        if (isMarkerVisible(marker.coordinate, location, 1000)) {
          Alert.alert(
            "You're close!",
            `You're close to ${marker.title}! Do you want to see how you can go?`,
            [
              {
                text: "No, I'm good.",
                onPress: () => console.log("User pressed no. :("),
                style: "cancel"
              },
              { text: "Yes, let's go!", onPress: () => handleMarkerPress(marker.coordinate, marker.title) }
            ],
            { cancelable: false }
          );
        }
      });
    };
  
    checkNearbyMarkers();
  }, [location, markers]);

  const isMarkerCloseEnough = (markerCoordinate, currentLocation) => {
    if (!currentLocation || !markerCoordinate) {
      return false;
    }
    const { latitude: markerLat, longitude: markerLng } = markerCoordinate;
    const { latitude: currentLat, longitude: currentLng } = currentLocation.coords;
    const distance = Math.sqrt(Math.pow(markerLat - currentLat, 2) + Math.pow(markerLng - currentLng, 2)) * 111000; // 1 derece = 111km
    return distance <= 100; // Yakınlık mesafesi 50 metreden az ise true döndür
  };

  useEffect(() => {
    const checkNearbyMarkers = () => {
      markers.forEach(marker => {
        if (isMarkerCloseEnough(marker.coordinate, location)) {
          setViewedMarker(marker); // Yakınındaki markerı işaret et
          setViewStartTime(Date.now()); // Başlangıç zamanını ayarla
        }
      });
    };
  
    checkNearbyMarkers();
  }, [location, markers]);
  
  useEffect(() => {
    let timer;
    if (viewStartTime) {
      timer = setTimeout(() => {
        // Eğer marker hala görüntüleniyorsa ve 15 saniye geçtiyse, popup'ı göster
        if (viewedMarker && Date.now() - viewStartTime >= 15000) {
          Alert.alert(
            "Hmm, Interesting.",
            `It looks like you have interest in ${viewedMarker.title}! Do you want to learn more?`,
            [
              {
                text: "No, I'm good.",
                onPress: () => console.log("User pressed no. :("),
                style: "cancel"
              },
              { text: "Yes, I'm astonished!", onPress: () => console.log("User pressed yes!") }
            ],
            { cancelable: false }
          );
        }
      }, 15000);
    }
    return () => clearTimeout(timer);
  }, [viewStartTime, viewedMarker]);
  

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
        region={initialRegion}
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
        {markers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            onPress={() => handleMarkerPress(marker.coordinate)}
          >
            <Callout
              onPress={() => handleCalloutPress(marker.title)}
            >
              <View>
                <Image style={styles.calloutImage} source={{ uri: marker.imageUri }} />
                <Text style={styles.calloutText}>{marker.title}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
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
        onRequestClose={() => setEstimatedTime(null)}
      >
        <TouchableWithoutFeedback onPress={() => {
          setEstimatedTime(null);
          setRouteCoordinates([]);
          setEstimatedTime(null);
          setDestinationSeleceted(false);
        }}>
          <View style = {styles.centeredView}>
            <View style = {styles.modalView}>
              <Text style = {styles.modalText}>Estimated time: {estimatedTime}</Text>
              <View style = {{ flexDirection: "row", flex: 1 }}>
                <TouchableOpacity
                  style = {styles.closeButton}
                  onPress= {() => {
                    setEstimatedTime(null);
                    setRouteCoordinates([]);
                    setEstimatedTime(null);
                    setDestinationSeleceted(false);
                  }}
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
              onPress = {() => Alert.alert("Rehber Tusu", "Tusa Basildi")}
            >
              <Text style = {{fontFamily: "monospace", color: "white", fontWeight: "bold", fontSize: 16}}>Local Guides</Text>
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
    marginBottom: 65,
    elevation: 10,
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
    height: 130,
    width: 350,

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
    elevation: 10,
    marginTop:8,
    marginBottom: 10,
    marginLeft: 220,
    position: "relative",
    top: 5,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: "monospace",
    color: 'white',
    alignSelf: 'center',
  },
  startButton: {
    backgroundColor: 'darkseagreen',
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 10,
    marginBottom: 10,
    position: 'absolute',
    bottom: 10,
    left: 175,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: "monospace",
    color: 'white',
    alignSelf: 'center',
  },
  localGuideButton: {
    backgroundColor: 'darkseagreen',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 10,
    marginBottom: 600,
    position: 'absolute',
    bottom: 17,
    right: 200,
  },
  calloutImage: {
    width: 150,
    height: 100,
    borderRadius: 10,
  },
  calloutText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: "monospace",
  }
});
