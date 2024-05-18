import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal, ScrollView, Linking } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import * as Speech from 'expo-speech';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native";
import { ToastAndroid } from "react-native";
import locations from "./Locations"

const ButtonWithBackground = props => {
  const navigation= useNavigation();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [summary, setSummary] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const addToFavorites = () => {
    setIsFavorite(true);
    console.log("Added to favorites:", props.text);
    ToastAndroid.showWithGravity(
      `${props.text} has been added to favorites!`,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
    console.log(isFavorite, props.text);
  };

  const removeFromFavorites = () => {
    setIsFavorite(false);
    ToastAndroid.showWithGravity(
      `${props.text} has been removed from favorites.`,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    )
  };

  
  // Vikipedi'den veri çekme fonksiyonu
  const fetchData = async (place) => {
    try {
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${place}`);
      const data = await response.json();
      setSummary(data.extract);
    } catch (error) {
      console.error("Data couldn't be fetched from the server:", error);
    }
  };

  // Butona tıklandığında çalışacak fonksiyon
  const handlePress = () => {
    fetchData(props.text);
    setModalVisible(true);
  };

  // Modal pencereyi kapatma fonksiyonu
  const closeModal = () => {
    setModalVisible(false);
  };

  // Metni seslendiren fonksiyon
  const speak = () => {
    Speech.speak(summary, { language: 'en' });
  };
  const openWikipediaPage = () => {
    Linking.openURL(`https://en.wikipedia.org/wiki/${props.text}`);
  };

  return ( <View>
    <View>
    <TouchableOpacity onPress={handlePress}>
      <LinearGradient colors={['black', 'darkseagreen']} style={styles.button}>
        
        <Image source={{uri: props.image}} style={styles.image} resizeMode="cover" />
        <Text style={styles.text}>{props.text}</Text>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalView}>
            <ScrollView>
              <Text>{summary}</Text>
              <View style={{ flexDirection:"row-reverse", flex: 1 }}>
              <TouchableOpacity onPress={speak} style={styles.speakButton}>
              <MaterialCommunityIcons name="text-to-speech" size={24} color="black" />              
              </TouchableOpacity>
              <TouchableOpacity onPress={openWikipediaPage} style={styles.wikiButton}>
                <FontAwesome name="wikipedia-w" size={24} color="black" />
              </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>

             
            </ScrollView>
          </View>
          
        </Modal>
        {isFavorite?(
          <MaterialCommunityIcons name="heart" size={32} color="white" style={styles.favoriteIcon} onPress={removeFromFavorites} />
        ) : ( <MaterialCommunityIcons name="heart-outline" size={32} color="white" style={styles.favoriteIcon} onPress={addToFavorites} />
      )}
      </LinearGradient>
    </TouchableOpacity>
    
    </View>

    </View>

    

    
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    padding: 16,
    width: 360,
    height: 240,
    borderRadius: 30,
    alignItems: "left",
    paddingHorizontal: 20,
  },
  text: {
    color: "white",
    fontSize: 16,
    marginTop: 188,
    fontFamily: "monospace"
  },
  image: {
    width: 360,
    height: 198,
    position: "absolute",
    marginBottom: 50,
    borderRadius:30,
  },
  modalView: {
    marginTop: 180,
    margin: 4,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: "absolute",
    width: "80%",
    height: "auto",
    marginLeft: 40,
  },
  speakButton: {
    backgroundColor: "darkseagreen",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    width: "48%",
    height: 45, 
    alignItems: "center",
    marginRight: "1%",
    marginLeft: "1.5%",
  },
  speakButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  wikiButton: {
    backgroundColor: "darkseagreen",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    width: "48%", // Yarısından biraz daha az genişlik
    alignItems: "center",
    marginLeft: "1%", // Sola hafif boşluk
  },
  wikiButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  closeButton: {
    backgroundColor: "darkseagreen",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  showMaps: {
    backgroundColor: "darkseagreen",
    zIndex: 1,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 640,
    marginLeft: 196, 
    width: 181,
  
  },
  favoriteIcon: {
    bottom: 210,
    left: 290,
    zIndex: 1,
  },
  savedButton: {
    position: "absolute",
  },
});

export default function App() {
//   const [locations, setLocations] = useState([
//     {
//       text: "Sultan Ahmed Mosque",
//       image:"https://trthaberstatic.cdn.wp.trt.com.tr/resimler/2032000/sultanahmet-camii-aa-2033022.jpg",
//       num: 1,
//     },
//     {
//       text: "Bosphorus",
//       image:"https://lh5.googleusercontent.com/proxy/w2dEY4MpQOYKVXAMSXXdG44ETq4Ac4aAO8cR0n2UQQQ01kSIJujFPIRcghHnSUBt2MbZ2Dg-qLFd7zwk0ab9FWmcfrsrEELWh5ckqX7agE7tLElhck-Ip45YOcrFeoPmFsfmSA",
//       num: 2,
//     },
//     {
//       text: "Avcilar Baris Manco Cultural Center",
//       image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/07/1c/96/27/very-nice-center.jpg?w=1200&h=1200&s=1",
//       num: 3,
//     },
//     {
//       text: "Topkapi Palace",
//       image: "https://istanbultarihi.ist/assets/uploads/files/cilt-8/topkapi-sarayi/3-topkapi-sarayi-gulhane-tarafindan.jpg",
//       num: 4,
//     },
//     {
//       text: "İstiklal Caddesi",
//       image: "https://i.neredekal.com/i/neredekal/75/585x300/607d72f6a26c8a5c640267bd",
//       num: 5,
//     },
//     {
//       text: "Technical University of Sofia",
//       image: "https://lh5.googleusercontent.com/proxy/dis_ROCaIxt6jwr0jlE2Gv9eXuLp2zE_YNE51WLWZj7FNAPRbsQVNZ8hFSMlKUZuI0dYMD7dqdT_VaY92xnBKOsBNg",
//       num: 6,
//     }
// ]);

  return (
    <View>
    <View style={styles.container}>
    {/* <ButtonWithBackground
        text= "Sultan Ahmed Mosque"
        image="https://trthaberstatic.cdn.wp.trt.com.tr/resimler/2032000/sultanahmet-camii-aa-2033022.jpg"
        onPress={() => handleShowOnMaps("Sultan Ahmed Mosque")}
        />
      <ButtonWithBackground
        text= "Bosphorus"
        image="https://lh5.googleusercontent.com/proxy/w2dEY4MpQOYKVXAMSXXdG44ETq4Ac4aAO8cR0n2UQQQ01kSIJujFPIRcghHnSUBt2MbZ2Dg-qLFd7zwk0ab9FWmcfrsrEELWh5ckqX7agE7tLElhck-Ip45YOcrFeoPmFsfmSA"
        onPress = {() => setSelectedLocation("Bosphorus")}
        />
        <ButtonWithBackground
        text = "Avcilar Baris Manco Cultural Center"
        image = "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/07/1c/96/27/very-nice-center.jpg?w=1200&h=1200&s=1"
        />
      <ButtonWithBackground
        text= "Topkapı Palace"
        image="https://istanbultarihi.ist/assets/uploads/files/cilt-8/topkapi-sarayi/3-topkapi-sarayi-gulhane-tarafindan.jpg"
        onPress = {() => setSelectedLocation("Topkapı Palace")}
        />
        <ButtonWithBackground
        text= "İstiklal Caddesi"
        image="https://i.neredekal.com/i/neredekal/75/585x300/607d72f6a26c8a5c640267bd"
        onPress = {() => setSelectedLocation("Istiklal Avenue")}
        />
        <ButtonWithBackground
        text= "Technical University of Sofia"
        image= "https://lh5.googleusercontent.com/proxy/dis_ROCaIxt6jwr0jlE2Gv9eXuLp2zE_YNE51WLWZj7FNAPRbsQVNZ8hFSMlKUZuI0dYMD7dqdT_VaY92xnBKOsBNg"
        onPress = {() => setSelectedLocation("Technical University of Sofia")}
        /> */}
        {locations.map(location => (
          <ButtonWithBackground
            key={location.text}
            text={location.text}
            image={location.image}
            isFavorite={location.isFavorite}
          />
        ))}
    </View>
    
    </View>
  );
}

const style2 = StyleSheet.create({
  weirdbutton: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    elevation: 10,
    backgroundColor: 'darkseagreen',
    height: 50,
    width: 300,
    top: 565,
    left: 30,
    elevation: 10,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  }
})
