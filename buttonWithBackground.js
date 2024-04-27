import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal, ScrollView, Linking } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import * as Speech from 'expo-speech';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const ButtonWithBackground = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [summary, setSummary] = useState("");
  
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

  return (
    <TouchableOpacity onPress={handlePress}>
      <LinearGradient colors={['olivedrab', 'rosybrown']} style={styles.button}>
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
      </LinearGradient>
    </TouchableOpacity>
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
    height: "auto"
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
});

export default function App() {
  return (
    <View style={styles.container}>
      <ButtonWithBackground
        text= "Sultan Ahmed Mosque"
        image="https://trthaberstatic.cdn.wp.trt.com.tr/resimler/2032000/sultanahmet-camii-aa-2033022.jpg"
      />
      <ButtonWithBackground
        text= "Bosphorus"
        image="https://lh5.googleusercontent.com/proxy/w2dEY4MpQOYKVXAMSXXdG44ETq4Ac4aAO8cR0n2UQQQ01kSIJujFPIRcghHnSUBt2MbZ2Dg-qLFd7zwk0ab9FWmcfrsrEELWh5ckqX7agE7tLElhck-Ip45YOcrFeoPmFsfmSA"
      />
      <ButtonWithBackground
        text= "Topkapı Palace"
        image="https://istanbultarihi.ist/assets/uploads/files/cilt-8/topkapi-sarayi/3-topkapi-sarayi-gulhane-tarafindan.jpg"
        />
        <ButtonWithBackground
        text= "İstiklal Caddesi"
        image="https://i.neredekal.com/i/neredekal/75/585x300/607d72f6a26c8a5c640267bd"
        />
    </View>
  );
}
