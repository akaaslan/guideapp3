import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal, ScrollView, Linking, Animated, LayoutAnimation, UIManager, Platform } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import * as Speech from 'expo-speech';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { ToastAndroid } from "react-native";
import locations from "./Locations";
import SettingsScreen from "./navigation/screens/SettingsScreen";


if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TestScreen = ({ location }) => {
  const [expanded, setExpanded] = useState(false);
  const [summary, setSummary] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageHeight] = useState(new Animated.Value(100)); 

  const addToFavorites = () => {
    setIsFavorite(true);
    ToastAndroid.showWithGravity(
      `${location.text} has been added to favorites!`,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
  };

  const removeFromFavorites = () => {
    setIsFavorite(false);
    ToastAndroid.showWithGravity(
      `${location.text} has been removed from favorites.`,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
  };

  const fetchData = async (place) => {
    try {
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${place}`);
      const data = await response.json();
      setSummary(data.extract);
    } catch (error) {
      console.error("Data couldn't be fetched from the server:", error);
    }
  };

  const handlePress = () => {
    fetchData(location.text);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
    Animated.timing(imageHeight, {
      toValue: expanded ? 120 : 240, // Genişletildiğinde yüksekliği değiştir
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const speak = () => {
    Speech.speak(summary, { language: 'en' });
  };

  const openWikipediaPage = () => {
    Linking.openURL(`https://en.wikipedia.org/wiki/${location.text}`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress}>
        <LinearGradient colors={['black', 'darkseagreen']} style={styles.button}>
          <Animated.Image source={{ uri: location.image }} style={[styles.image, { height: imageHeight }]} resizeMode="cover" />
          <Text style={styles.text}>{location.text}</Text>
        </LinearGradient>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.expandedContent}>
          <ScrollView>
            <Text style={styles.summaryText}>{summary}</Text>
            <View style={styles.iconRow}>
              <TouchableOpacity onPress={speak} style={styles.speakButton}>
                <MaterialCommunityIcons name="text-to-speech" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={openWikipediaPage} style={styles.wikiButton}>
                <FontAwesome name="wikipedia-w" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handlePress} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
      {isFavorite ? (
        <MaterialCommunityIcons name="heart" size={32} color="white" style={styles.favoriteIcon} onPress={removeFromFavorites} />
      ) : (
        <MaterialCommunityIcons name="heart-outline" size={32} color="white" style={styles.favoriteIcon} onPress={addToFavorites} />
      )}
    </View>
  );
};

const TestScreenWrapper = () => {
  return (
    <ScrollView style={{marginBottom: 80}}>
      {locations.map((location) => (
        <TestScreen key={location.text} location={location} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  button: {
    padding: 10,
    width: 360,
    borderRadius: 30,
    alignItems: "center",
    paddingHorizontal: 10,
    alignSelf: "center"
    
  },
  text: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "monospace",
  },
  image: {
    width: 360,
    borderRadius: 30,
    bottom:16,
  },
  expandedContent: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 10,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 10,
    // marginLeft:15
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  speakButton: {
    backgroundColor: "darkseagreen",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    width: "45%",
    alignItems: "center",
    marginLeft: 5
  },
  wikiButton: {
    backgroundColor: "darkseagreen",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    width: "45%",
    alignItems: "center",
    marginRight: 5
  },
  closeButton: {
    backgroundColor: "darkseagreen",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    alignItems: "center",
    width: 340,

  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  favoriteIcon: {
    position: "absolute",
    top: 10,
    right: 20,
    zIndex: 1,
  },
});

export default TestScreenWrapper;


// export default function App() {
// //   const [locations, setLocations] = useState([
// //     {
// //       text: "Sultan Ahmed Mosque",
// //       image:"https://trthaberstatic.cdn.wp.trt.com.tr/resimler/2032000/sultanahmet-camii-aa-2033022.jpg",
// //       num: 1,
// //     },
// //     {
// //       text: "Bosphorus",
// //       image:"https://lh5.googleusercontent.com/proxy/w2dEY4MpQOYKVXAMSXXdG44ETq4Ac4aAO8cR0n2UQQQ01kSIJujFPIRcghHnSUBt2MbZ2Dg-qLFd7zwk0ab9FWmcfrsrEELWh5ckqX7agE7tLElhck-Ip45YOcrFeoPmFsfmSA",
// //       num: 2,
// //     },
// //     {
// //       text: "Avcilar Baris Manco Cultural Center",
// //       image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/07/1c/96/27/very-nice-center.jpg?w=1200&h=1200&s=1",
// //       num: 3,
// //     },
// //     {
// //       text: "Topkapi Palace",
// //       image: "https://istanbultarihi.ist/assets/uploads/files/cilt-8/topkapi-sarayi/3-topkapi-sarayi-gulhane-tarafindan.jpg",
// //       num: 4,
// //     },
// //     {
// //       text: "İstiklal Caddesi",
// //       image: "https://i.neredekal.com/i/neredekal/75/585x300/607d72f6a26c8a5c640267bd",
// //       num: 5,
// //     },
// //     {
// //       text: "Technical University of Sofia",
// //       image: "https://lh5.googleusercontent.com/proxy/dis_ROCaIxt6jwr0jlE2Gv9eXuLp2zE_YNE51WLWZj7FNAPRbsQVNZ8hFSMlKUZuI0dYMD7dqdT_VaY92xnBKOsBNg",
// //       num: 6,
// //     }
// // ]);

//   return (
//     <View>
//     <View style={styles.container}>
//     {/* <ButtonWithBackground
//         text= "Sultan Ahmed Mosque"
//         image="https://trthaberstatic.cdn.wp.trt.com.tr/resimler/2032000/sultanahmet-camii-aa-2033022.jpg"
//         onPress={() => handleShowOnMaps("Sultan Ahmed Mosque")}
//         />
//       <ButtonWithBackground
//         text= "Bosphorus"
//         image="https://lh5.googleusercontent.com/proxy/w2dEY4MpQOYKVXAMSXXdG44ETq4Ac4aAO8cR0n2UQQQ01kSIJujFPIRcghHnSUBt2MbZ2Dg-qLFd7zwk0ab9FWmcfrsrEELWh5ckqX7agE7tLElhck-Ip45YOcrFeoPmFsfmSA"
//         onPress = {() => setSelectedLocation("Bosphorus")}
//         />
//         <ButtonWithBackground
//         text = "Avcilar Baris Manco Cultural Center"
//         image = "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/07/1c/96/27/very-nice-center.jpg?w=1200&h=1200&s=1"
//         />
//       <ButtonWithBackground
//         text= "Topkapı Palace"
//         image="https://istanbultarihi.ist/assets/uploads/files/cilt-8/topkapi-sarayi/3-topkapi-sarayi-gulhane-tarafindan.jpg"
//         onPress = {() => setSelectedLocation("Topkapı Palace")}
//         />
//         <ButtonWithBackground
//         text= "İstiklal Caddesi"
//         image="https://i.neredekal.com/i/neredekal/75/585x300/607d72f6a26c8a5c640267bd"
//         onPress = {() => setSelectedLocation("Istiklal Avenue")}
//         />
//         <ButtonWithBackground
//         text= "Technical University of Sofia"
//         image= "https://lh5.googleusercontent.com/proxy/dis_ROCaIxt6jwr0jlE2Gv9eXuLp2zE_YNE51WLWZj7FNAPRbsQVNZ8hFSMlKUZuI0dYMD7dqdT_VaY92xnBKOsBNg"
//         onPress = {() => setSelectedLocation("Technical University of Sofia")}
//         /> */}
//         {locations.map(location => (
//           <ButtonWithBackground
//             key={location.text}
//             text={location.text}
//             image={location.image}
//             isFavorite={location.isFavorite}
//           />
//         ))}
//     </View>
    
//     </View>
//   );
// }

// const style2 = StyleSheet.create({
//   weirdbutton: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'absolute',
//     elevation: 10,
//     backgroundColor: 'darkseagreen',
//     height: 50,
//     width: 300,
//     top: 565,
//     left: 30,
//     elevation: 10,
//     borderRadius: 10,
//     shadowOffset: {
//       width: 0,
//       height: 2
//     },
//     shadowOpacity: 0.5,
//     shadowRadius: 5,
//   }
// })
