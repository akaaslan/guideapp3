import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal, ScrollView, Linking, Animated, LayoutAnimation, UIManager, Platform } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import * as Speech from 'expo-speech';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { ToastAndroid } from "react-native";
import locations from "../../Locations";

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TestScreen = ({ location }) => {
  const [expanded, setExpanded] = useState(false);
  const [summary, setSummary] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageHeight] = useState(new Animated.Value(100)); // Başlangıç yüksekliği

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
    padding: 16,
    width: 360,
    borderRadius: 30,
    alignItems: "center",
    paddingHorizontal: 20,
    left: 17,
  },
  text: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
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
    marginLeft:15
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
    marginLeft: 10
  },
  wikiButton: {
    backgroundColor: "darkseagreen",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    width: "45%",
    alignItems: "center",
    marginRight: 10
  },
  closeButton: {
    backgroundColor: "darkseagreen",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    alignItems: "center",
    width: 355,
    left: 10
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  favoriteIcon: {
    position: "absolute",
    top: 10,
    right: 30,
    zIndex: 1,
  },
});

export default TestScreenWrapper;
