import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Linking, TouchableWithoutFeedback, Alert, Image, ScrollView, Switch, Button, TextInput, FlatList, ToastAndroid } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline, Callout, Polygon } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import BosphorusIcon from "./../../icons/bosphorus.png"
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import ActionButton from '../../ActionButton';
// import markersData from "../../Markers"

export default function MapScreen({ navigation }) {
  const mapRef = useRef(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [acModal1Visible, setacModal1Visible] = useState(false);
  const [acModal2Visible, setacModal2Visible] = useState(false);
  const [acModal3Visible, setacModal3Visible] = useState(false);
  const [acModalSettingsVisible, setacModalSettingsVisible] = useState(false);
  const [showRoutePolyline, setShowRoutePolyline] = useState(true);
  const [isCloseEnoughEnabled, setIsCloseEnoughEnabled] = useState(false);
  const [destinationSelected, setDestinationSeleceted] = useState(false);
  const [viewedMarker, setViewedMarker] = useState(null); 
  const [viewStartTime, setViewStartTime] = useState(null); 
  const [selectedName, setSelectedName] = useState(null);
  const [nearestMarkers, setNearestMarkers] = useState([]);
  const [searchLocation, setSearchLocation] = useState("");
  const [favMarkers, setFavMarkers] = useState([]);
  const [markers, setMarkers] = useState([
    { id: 1, title: "Blue Mosque", coordinate: { latitude: 41.0055, longitude: 28.9769 }, isfav: true, icon: null, imageUri: 'https://trthaberstatic.cdn.wp.trt.com.tr/resimler/2032000/sultanahmet-camii-aa-2033022.jpg' },
    { id: 2, title: "Bosphorus", coordinate: { latitude: 41.04654252347306, longitude: 29.03422380818258 }, isfav: true, icon: null, imageUri: 'https://lh5.googleusercontent.com/proxy/w2dEY4MpQOYKVXAMSXXdG44ETq4Ac4aAO8cR0n2UQQQ01kSIJujFPIRcghHnSUBt2MbZ2Dg-qLFd7zwk0ab9FWmcfrsrEELWh5ckqX7agE7tLElhck-Ip45YOcrFeoPmFsfmSA' },
    { id: 3, title: "Topkapi Palace", coordinate: { latitude: 41.0115, longitude: 28.9814 }, isfav: true, icon: null, imageUri: 'https://istanbultarihi.ist/assets/uploads/files/cilt-8/topkapi-sarayi/3-topkapi-sarayi-gulhane-tarafindan.jpg' },
    { id: 4, title: "Istiklal Avenue", coordinate: { latitude: 41.0283, longitude: 28.9731 }, isfav: false, icon: null, imageUri: null },
    { id: 5, title: "Technical University of Sofia", coordinate: { latitude: 42.65714634396518, longitude: 23.355303595910726 }, isfav: false, icon: null, imageUri: null },
    { id: 6, title: "Baris Manco Culture Center", coordinate: { latitude: 40.980239681936496, longitude: 28.72036129984934 }, isfav: false, icon: null, imageUri: null },
    { id: 7, title: "Tüpraş Stadium", coordinate: {latitude: 41.03939288554953, longitude: 28.994486794538503}, isfav: false, icon: null, imageUri: null},
    { id: 8, title: "Rumeli Pilavcısı Haluk Baba", coordinate: {latitude:40.97858758276236, longitude:28.72354731953755}, isfav: false, icon: null, imageUri: `https://img.restaurantguru.com/r3c7-Rumeli-Pilavc-s-interior-2021-09-3.jpg`}
  ]);

  const GOOGLE_MAPS_API_KEY = 'AIzaSyDkk9xmxjAS0BMU9ym4_e6LTdBlArakEnI'; // Google Maps API anahtarınızı buraya ekleyin
  const screenRoute = useRoute();

  const toggleFavorite = (markerId) => {
    setMarkers(prevMarkers => {
      return prevMarkers.map(marker => {
        if (marker.id === markerId) {
          return { ...marker, isfav: !marker.isfav };
        }
        return marker;
      });
    });
  };
  
  useEffect(() => {
    const filteredMarkers = markers.filter(marker => marker.isfav);
    setFavMarkers(filteredMarkers);
  }, [markers]);

  const mapDark = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#263c3f"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#6b9a76"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#38414e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#212a37"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9ca5b3"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#1f2835"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#f3d19c"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2f3948"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#515c6d"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    }
  ]
  const mapStandard = [[]]
  const [mapStyle, setMapStyle] = useState(mapStandard);
  useEffect(() => {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    let style = mapStandard; 
    if (currentHour >= 20 || currentHour < 6) {
      style = mapDark;
    }
    setMapStyle(style);
  }, []);

  const handleCalloutPress = (title) => {
    setSelectedName(title);
    console.log(title);
    if (title === "Tüpraş Stadium") {
      Alert.alert(
        "Confirmation",
        "Do you want to visit the event page for Tüpraş Stadium?",
        [
          {
            text: "Visit",
            onPress: () => {
              Linking.openURL("https://www.passo.com.tr/en/etkinlik-grubu/stadyum-konserleri/702613");
            }
          },
          {
            text: "No, thanks.",
            style: "cancel",
            },
        ]
      );
    } else if (title === "Baris Manco Culture Center") {
      Alert.alert(
        "Confirmation",
        "Would you like to see what is the upcoming events for this center?",
        [{
          text: "Of course!",
          onPress: () => {
            Linking.openURL("https://www.avcilar.bel.tr/etkinlikler.php");
          }
        },
        {
          text: "No, thanks.",
          style: "cancel",
          },
      ]
      )
    }  else {
      // Farklı bir marker için Wikipedia sayfasına yönlendir
      navigateToWikipedia(title);
    }
  }

  const navigateToWikipedia = (title) => {
    // Marker başlığından boşlukları kaldırarak Wikipedia URL'sini oluştur
    const wikipediaTitle = title.replace(/\s+/g, '_');
    const wikipediaUrl = `https://en.wikipedia.org/wiki/${wikipediaTitle}`;
  
    // URL'yi aç
    Linking.openURL(wikipediaUrl)
      .catch(err => console.error('Error opening Wikipedia page:', err));
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

  const findNearestMarkers = () => {
    if (!location) {
      console.log("Location is not available yet.");
      return;
    }
    const sortedMarkers = markers
      .map(marker => {
        const distance = Math.sqrt(
          Math.pow(marker.coordinate.latitude - location.coords.latitude, 2) +
          Math.pow(marker.coordinate.longitude - location.coords.longitude, 2)
        ) * 111000; // 1 derece = 111km
        return { ...marker, distance };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  
    setModalVisible(true);
    setNearestMarkers(sortedMarkers);
  };

  // useEffect(() => {
  //   const checkNearbyMarkers = () => {
  //     markers.forEach(marker => {
  //       if (isMarkerVisible(marker.coordinate, location, 1000)) {
  //         Alert.alert(
  //           "You're close!",
  //           `You're close to ${marker.title}! Do you want to see how you can go?`,
  //           [
  //             {
  //               text: "No, I'm good.",
  //               onPress: () => console.log("User pressed no. :("),
  //               style: "cancel"
  //             },
  //             { text: "Yes, let's go!", onPress: () => handleMarkerPress(marker.coordinate, marker.title) }
  //           ],
  //           { cancelable: false }
  //         );
  //       }
  //     });
  //   };
  
  //   checkNearbyMarkers();
  // }, [location, markers]);

  const isMarkerCloseEnough = (markerCoordinate, currentLocation, ) => {
    if (!isCloseEnoughEnabled || !currentLocation || !markerCoordinate) {
      return false;
    }
    const { latitude: markerLat, longitude: markerLng } = markerCoordinate;
    const { latitude: currentLat, longitude: currentLng } = currentLocation.coords;
    const distance = Math.sqrt(Math.pow(markerLat - currentLat, 2) + Math.pow(markerLng - currentLng, 2)) * 111000; // 1 derece = 111km
    return distance <= 300; // Yakınlık mesafesi 50 metreden az ise true döndür
  };

  const setIsCloseEnoughSwitch = () => setIsCloseEnoughEnabled(previousState => !previousState);
  

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

  const goToWikipedia = () => {
    if (viewedMarker) {
      const title = viewedMarker.title.replace(/\s+/g, '_'); // Boşlukları alt çizgi ile değiştir
      const wikipediaUrl = `https://en.wikipedia.org/wiki/${viewedMarker.title}`;
      Linking.openURL(wikipediaUrl);
    }
  };
  
  useEffect(() => {
    let timer;
    if (isEnabled && viewStartTime) { // isEnabled true ve viewStartTime varsa, useEffect çalışacak
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
              { text: "Yes, I'm astonished!", onPress: () => {goToWikipedia()} } // goToWikipedia fonksiyonunu çağırmak için parantez eklenmeli
            ],
            { cancelable: false }
          );
        }
      }, 15000);
    }

    // useEffect'den dönen fonksiyon bir temizleme fonksiyonudur, component unmount edildiğinde çalışır
    return () => clearTimeout(timer);
  }, [isEnabled, viewStartTime, viewedMarker]);

  const focusOnMarker = (markerCoordinate) => {
    if (mapRef.current && markerCoordinate) {
      mapRef.current.animateCamera({
        center: markerCoordinate,
        zoom: 15, 
      });
    }
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

  let initialRegion = {
    latitude: location ? location.coords.latitude : 40.9819,
    longitude: location ? location.coords.longitude : 28.7178,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const openModalSettings = () => {
    setacModalSettingsVisible(true);
  };

  const openModal1 = () => {
    setacModal1Visible(true);
  };

  const openModal2 = () => {
    setacModal2Visible(true);
  };

  const openModal3 = () => {
    setacModal3Visible(true);
  };
  const filterMarkers = () => {
    const searchQuery = searchLocation.trim().toLowerCase();
    const matchingMarker = markers.find(marker => marker.title.toLowerCase() === searchQuery);
    if (matchingMarker) {
      handleMarkerPress(matchingMarker.coordinate, matchingMarker.title);
    } else {
      console.log("No location has been found.");
    }
  };
  const filteredData = markers.filter(item =>
    item.title.toLowerCase().startsWith(searchLocation.toLowerCase())
  );
  
  const [selectedLocations, setSelectedLocations] = useState([]);
  const toggleLocationSelection = (id) => {
    const index = selectedLocations.indexOf(id);
    if (index === -1) {
      setSelectedLocations([...selectedLocations, id]);
    } else {
      setSelectedLocations(selectedLocations.filter((item) => item !== id));
    };
    handleShowPolylineRoute();
  };

  const renderMarkers = () => {
    return markers.map((marker) => (
      <Marker
      key={marker.id}
      coordinate={marker.coordinate}
      title = {marker.title}
      onPress={() => toggleLocationSelection(marker.id)}/>
    ));
  }
  const renderPolylineRoute = async () => {
    // Kullanıcının mevcut konumunu al
    if (!showRoutePolyline) return null;
    let location = null;
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Konum izni verilmedi');
        return null;
      }
      
      location = await Location.getCurrentPositionAsync({});
    } catch (error) {
      console.error('Error getting user location:', error);
      return null;
    }
  
    const selectedMarkers = markers.filter((marker) => selectedLocations.includes(marker.id));
    const coordinates = selectedMarkers.map((marker) => marker.coordinate);
  
    // Eğer seçilen marker sayısı 1 veya daha azsa, polygon çizmeye gerek yok
    if (coordinates.length < 2) {
      return null;
    }
  
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${location.coords.latitude},${location.coords.longitude}&destination=${coordinates[coordinates.length - 1].latitude},${coordinates[coordinates.length - 1].longitude}&waypoints=${coordinates.slice(0, coordinates.length - 1).map(coord => `${coord.latitude},${coord.longitude}`).join('|')}&key=${GOOGLE_MAPS_API_KEY}`);
      const data = await response.json();
      const points = decodePolyline(data.routes[0].overview_polyline.points);
  
      // Oluşturulan polyline'in koordinatlarını içeren bir polygon çiz
      return <Polyline coordinates={[{latitude: location.coords.latitude, longitude: location.coords.longitude}, ...points]} strokeColor='darkseagreen' strokeWidth={4} />;
    } catch (error) {
      console.error('Error fetching directions:', error);
      return null;
    }
  };

  const handleClearPolylineRoute = () => {
    setShowRoutePolyline(false);
    setRouteCoordinates([]);
    setDestination(null);
    setSelectedLocations([]);
    setEstimatedTime(null);
  };

  const handleShowPolylineRoute = () => {
    setShowRoutePolyline(true);
  }


  return (
    <View style={{ flex: 1 }}>
      <MapView
      customMapStyle={mapStyle}
      ref = {mapRef}
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
            onPress={() => {handleMarkerPress(marker.coordinate); focusOnMarker(marker.coordinate);}}
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
        {renderMarkers()}
        {renderPolylineRoute()}
      </MapView>
      <TouchableOpacity
  style={styles.searchButton}
  onPress={findNearestMarkers}
>
  <Text style={styles.searchButtonText}>Search Nearby</Text>
</TouchableOpacity>
<Modal
  animationType='fade'
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
    <View style={styles.centeredView}>
      <View style={styles.modalNearbyView}>
        <ScrollView>
        <Text style={styles.modalText}>Nearest Locations:</Text>
        {nearestMarkers.map(marker => (
  <TouchableOpacity
    key={marker.id}
    style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}
    onPress={() => handleMarkerPress(marker.coordinate, marker.title)}
  >
    <Text style={{ fontFamily: "monospace", marginRight: 5 }}>{marker.title}</Text>
    <Text style={{ fontFamily: "monospace", color: "gray" }}>
      ({marker.distance > 1000 ? `${(marker.distance / 1000).toFixed(2)} km` : `${marker.distance.toFixed(2)} mt`})
    </Text>
  </TouchableOpacity>
))}

        
        </ScrollView>
      </View>
    </View>
  </TouchableWithoutFeedback>
</Modal>

      <TouchableOpacity
        style={styles.goButton}
        onPress={() => handleMarkerPress(destination)}
      >
        <Text style={styles.goButtonText}>How can I go?</Text>
      </TouchableOpacity>
      <Modal
  animationType='fade'
  transparent={true}
  visible={estimatedTime !== null}
  onRequestClose={() => setEstimatedTime(null)}
>
  <TouchableWithoutFeedback>
    <TouchableWithoutFeedback onPress={() => {
      setEstimatedTime(null);
      setRouteCoordinates([]);
      setEstimatedTime(null);
      setDestinationSeleceted(false);
    }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Estimated time: {estimatedTime}</Text>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <TouchableOpacity 
              style={{ 
                backgroundColor: markers.isfav ? "salmon" : "darkseagreen", 
                width: 300, 
                height: 50,
                alignItems: "center"
              }}
              onPress={() => {toggleFavorite(markers.id),console.log(`${markers.isfav},${markers.title}`)}} // toggleFavorite fonksiyonunu çağırırken marker'ın id'sini değil, title'ını gönderiyoruz
            >
              <Text>
                {markers.isfav ? "In Favorites" : "Add To Favorites"}
                <AntDesign name={markers.isfav ? "heart" : "hearto"} size={24} color="black" />
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setEstimatedTime(null);
              setRouteCoordinates([]);
              setEstimatedTime(null);
              setDestinationSeleceted(false);
            }}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.localGuideButton}
            onPress={() => Alert.alert("Rehber Tusu", "Tusa Basildi")}
          >
            <Text style={{ fontFamily: "monospace", color: "white", fontWeight: "bold", fontSize: 16 }}>Local Guides</Text>
          </TouchableOpacity>
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
      </View>
    </TouchableWithoutFeedback>
  </TouchableWithoutFeedback>
</Modal>

      
      <View>

      </View>
      {/* action buttonun modalları burada 
      ---------------------------------------
      ---------------------------------------*/}


      <ActionButton style = {{top: 510, left: 330}} 
      openModal1 = {openModal1} 
      openModal2 = {openModal2} 
      openModal3 = {openModal3}
      openModalSettings = {openModalSettings}/>

      {/* modal route */}
      <Modal
        animationType='fade'
        transparent={true}
        visible={acModalSettingsVisible}
        onRequestClose={() => setacModalSettingsVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setacModalSettingsVisible(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{fontFamily: "monospace", fontWeight: "bold", alignSelf: "baseline"}}>Disable Nearby Marker Alerts:</Text>
              <Switch
              trackColor={{false: "white", true: "darkseagreen"}}
              thumbColor={isCloseEnoughEnabled ? "darkseagreen" : "darkseagreen"}
              onValueChange={setIsCloseEnoughSwitch}
              value= {isCloseEnoughEnabled}
              style = {{position: "absolute", left: 260, top: 2}}/>
              
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>


      <Modal
        animationType='fade'
        transparent={true}
        visible={acModal1Visible}
        onRequestClose={() => setacModal1Visible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setacModal1Visible(false)}>
          <View style={styles.centeredView}>
            <View style={{backgroundColor: "#FFF", 
            width: 400, 
            height: 555, 
            alignContent: "center",
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
            width: "90%",
            margin: 10,
            borderRadius: 20}}>
              <Text style={styles.modalText}>Select Locations</Text>
              <TouchableOpacity onPress = {() => setacModal1Visible(false)}
              style = {{left: 140, bottom: 40}}>
              <FontAwesome name="close" size={24} color= "darkseagreen" />
              </TouchableOpacity>
              {markers.map((marker) =>(
                <View  key = {marker.id} style = {{flexDirection: "row", alignItems: 'center', marginVertical: 5}}>
                  <TouchableOpacity
                  onPress={() => {toggleLocationSelection(marker.id),console.log(marker.title), 
                    ToastAndroid.showWithGravity(`${marker.title} has been added to the route!`,
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                    
                  );}}
                  style = {{backgroundColor: "darkseagreen", width: 300, height:45, borderRadius: 5, alignContent: "center", justifyContent:"center", bottom: 25}}>
                    <Text style = {{fontWeight:"bold", fontFamily:"monospace", fontSize: 16, alignItems: "center", marginLeft: 50}}>{selectedLocations.includes(marker.id) ? `${marker.title}` : `${marker.title}`}</Text>
                  </TouchableOpacity>
                  
                </View>
              ))}
              <TouchableOpacity onPress = {handleClearPolylineRoute}
                  style = {{backgroundColor: "#520404", width: 300, height:45, borderRadius: 5, alignContent: "center", justifyContent:"center", bottom: 25}}>
                    <Text
                    style = {{fontWeight:"bold", fontFamily:"monospace", fontSize: 16, alignItems: "center", marginLeft: 50}}>Clear Route</Text>
                    <AntDesign name="delete" size={24} color="black" style= {{position: "absolute", left: 15}} />
                  </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* modal liked */}

      <Modal
  animationType='fade'
  transparent={true}
  visible={acModal2Visible}
  onRequestClose={() => setacModal2Visible(false)}
>
  <TouchableWithoutFeedback onPress={() => setacModal2Visible(false)}>
    <View style={styles.centeredView}>
      <View style={{backgroundColor: "#FFF", 
            width: 400, 
            height: "auto", 
            alignContent: "center",
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
            width: "90%",
            margin: 10,
            borderRadius: 20}}>
        <Text style={styles.modalText}>Saved Markers</Text>
        <TouchableOpacity onPress={() => setacModal2Visible(false)} style={{ left: 140, bottom: 40 }}>
          <FontAwesome name="close" size={24} color="darkseagreen" />
        </TouchableOpacity>
        {favMarkers.map(marker => (
          <View key={marker.id} style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
            <TouchableOpacity onPress={() => handleMarkerPress(marker.coordinate, marker.title)}
            style = {{backgroundColor: "darkseagreen", width: 300, height:45, borderRadius: 5, alignContent: "center", justifyContent:"center", bottom: 25}}>
              <Text style={{ fontFamily: "monospace", fontWeight: "bold", fontSize: 16, left: 100 }}>{marker.title}{marker.icon}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  </TouchableWithoutFeedback>
</Modal>



      {/* modal search */}

      <Modal
        animationType='slide'
        transparent={true}
        visible={acModal3Visible}
        onRequestClose={() => setacModal3Visible(false)}
        style = {{
          top: 100,
          height: 100,
          width: 100,
        }}
      >
        <TouchableWithoutFeedback onPress={() => {setacModal3Visible(false); setSearchLocation("")}}>
          <View style={styles.centeredView}>
            <View style={styles.acModalStyle}>
              <TextInput
              style = {styles.searchBarModal}
              placeholder={'Search for a location...'}
              value = {searchLocation}
              onChangeText={setSearchLocation}/>
                  <FlatList
          data={filteredData}
          renderItem={({ item }) => (
            <View>
            <TouchableOpacity
              style={styles.markerItem}
              onPress={() => {handleMarkerPress(item.coordinate, item.title); setacModal3Visible(false); setSearchLocation("")}}
            >
              <Image source = {{uri: item.icon}}/>
              <Text style={styles.acmarkerItemText}>{item.title}</Text>
            </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.id.toString()}
        />
        <TouchableOpacity style = {{
                left: 100,
                top: 30,
                height: 40, 
                width: 100, 
                borderRadius: 10,
                backgroundColor: "darkseagreen",
                alignItems: "center",
                justifyContent: "center"}} 
                onPress={() => {setacModal3Visible(false); setSearchLocation("")}}>
                  <Text style = {{fontFamily: "monospace", fontSize: 16, fontWeight: "bold"}}>Close</Text>
                  </TouchableOpacity>
                <TouchableOpacity style = {{
                bottom: 10,
                right: 10,
                height: 40, 
                width: 100, 
                borderRadius: 10,
                backgroundColor: "darkseagreen",
                alignItems: "center",
                justifyContent: "center"}} 
                onPress={() => { filterMarkers(); setacModal3Visible(false); setSearchLocation("")}}>
                    <Text style = {{fontFamily: "monospace", fontSize: 16, fontWeight: "bold"}}>Search</Text>
                  </TouchableOpacity>
            </View>
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
    left: 22,
  },
  goButtonText: {
    fontSize: 16,
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
    height: 200,
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
    marginBottom: 7,
    marginLeft: 220,
    position: "relative",
    height: 40
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
    paddingVertical: 10,
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
    marginBottom: 10,
    position: 'absolute',
    bottom: 10,
    left: 14,
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
  },
  searchButton: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'darkseagreen',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 10,
    bottom: 85,
    left: 197,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: "monospace"
  },
  modalNearbyView: {
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
    height: 150,
    width: 350,
  },
  searchBarModal: {
    width: 300,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  acModalStyle: {
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
    height: 350,
    width: 350,
  },
  acmarkerItemText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "monospace",
    color: "black",
    justifyContent: "flex-start",
    alignItems: "stretch",
    textAlign: "left",
  },
  acModal2Style: {

  },
  acModal1Style: {

  }
});
