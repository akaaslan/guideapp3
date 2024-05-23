import * as React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Animated, LayoutAnimation, UIManager, Platform, ScrollView, Linking, Image } from "react-native";
import { AntDesign, FontAwesome5, FontAwesome6 , Ionicons} from '@expo/vector-icons';
import foti from "../../icons/ben.jpg"

export default function SettingsScreen() {
  if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const [expanded, setExpanded] = React.useState({
    personalInfo: false,
    accountSettings: false,
    emergencyNumbers: false,
  });

  const [animationHeights, setAnimationHeights] = React.useState({
    personalInfo: new Animated.Value(60),
    accountSettings: new Animated.Value(60),
    emergencyNumbers: new Animated.Value(60),
  });

  const toggleExpand = (section) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const isExpanded = expanded[section];
    const newHeight = isExpanded ? 60 : 200; // Kapalıysa 50, açıkken 200 piksel

    Animated.timing(animationHeights[section], {
      toValue: newHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setExpanded({
      ...expanded,
      [section]: !isExpanded,
    });
  };


  const expandPhoto = () => {}

  const [buttonText, setButtonText] = React.useState("hidden");
  const pwButtonChange = () => {
    setButtonText( buttonText === "hidden" ? "123456789" : "hidden")
  }
  return (
    <ScrollView>
    <View>
      <View>
      <TouchableOpacity style={{ backgroundColor: "darkseagreen", height: 90, width: 90, borderRadius: 45, marginLeft: 20, marginTop: 20 }}>
      <Image
       source={foti} 
       style={{ height: 90, width: 90, borderRadius: 45, alignSelf: "center"}}
      />
</TouchableOpacity>
        <Text style={{ left: 7 }}>
          <AntDesign name="star" size={20} color="darkslategrey" /> <AntDesign name="star" size={20} color="darkslategrey" /> <AntDesign name="star" size={20} color="darkslategrey" /> <AntDesign name="star" size={20} color="darkslategrey" /> <AntDesign name="staro" size={20} color="darkslategrey" />
        </Text>
        <Text style={{ fontFamily: "monospace", fontWeight: "bold", fontSize: 32, position: "absolute", left: 120, top: 25 }}> Ahmet Kaan</Text>
        <Text style={{ fontFamily: "monospace", fontWeight: "bold", fontSize: 32, position: "absolute", left: 120, top: 65 }}> Aslan</Text>
      </View>
      
      <View style = {{marginTop: 20}}>
      <Animated.View style={[styles.animatedView, { height: animationHeights.personalInfo }]}>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => toggleExpand('personalInfo')}>
          <Text style={styles.textStyle}>Personal Information</Text>
          <FontAwesome6 name="person" size={24} color="black" style={{ marginLeft: 20, position: "absolute", left: 290 }} />
        </TouchableOpacity>
        {expanded.personalInfo && (
          <View style={styles.expandedContent}>
            <Text style= {styles.expandedText}>Gender:   Male</Text>
            <Text style= {styles.expandedText}>Nationality:   Turkish</Text>
            <Text style= {styles.expandedText}>Phone Number:   +905331234567</Text>
            <Text style= {styles.expandedText}>Address: ---</Text>
          </View>
        )}
      </Animated.View>
      </View>
      <View style = {{marginTop: 10}}>
      <Animated.View style={[styles.animatedView, { height: animationHeights.accountSettings }]}>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => toggleExpand('accountSettings')}>
          <Text style={styles.textStyle}>Account Settings</Text>
          <AntDesign name="setting" size={20} color="black" style={{ marginLeft: 20, position: "absolute", left: 290 }} />
        </TouchableOpacity>
        {expanded.accountSettings && (
          <View style={styles.expandedContent}>
            <Text style= {styles.expandedText}>E-Mail:   aaslan@tu-sofia.bg</Text>
            <Text style = {styles.expandedText}>Password: </Text>
            <TouchableOpacity 
            onPress={pwButtonChange}
            ><Text
            style= {{color: "grey", 
            fontFamily: "monospace", 
            fontWeight: "700",
            fontSize: 14,
            left:85,
            bottom: 20}}>{buttonText}</Text></TouchableOpacity>
            
          </View>
        )}
      </Animated.View>
      </View>
      <View style = {{marginTop: 10}}>
      <Animated.View style={[styles.animatedView, { height: animationHeights.emergencyNumbers }]}>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => toggleExpand('emergencyNumbers')}>
          <Text style={styles.textStyle}>Emergency Numbers</Text>
          <FontAwesome5 name="ambulance" size={24} color="black" style={styles.iconStyle} />
        </TouchableOpacity>
        {expanded.emergencyNumbers && (
          <View style={styles.expandedContent}>
            <Text style= {styles.contactText}>Contact 1: +905337675322</Text>
            <TouchableOpacity onPress = {() => {Linking.openURL(`tel:${+905337675322}`)}}
            style = {{left: 310, marginLeft: 20,position: "absolute", alignSelf: "center", top: 10}}>
                <Ionicons name="call-sharp" size={24} color="black" />
                </TouchableOpacity>
          </View>
        )}
      </Animated.View>
      </View>
      
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  animatedView: {
    overflow: "hidden",
    alignSelf: "center",
    width: '100%',
  },
  buttonStyle: {
    overflow: "hidden",
    borderColor: "lightgrey",
    borderWidth: 2,
    width: 350,
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignSelf: "center",
    marginTop:10,
  },
  textStyle: {
    fontSize: 16,
    fontFamily: "monospace",
    fontWeight: "900",
    marginLeft: 30,
  },
  iconStyle: {
    marginLeft: 20,
    position: "absolute",
    left: 290,
    alignSelf: "center",
  },
  expandedContent: {
    padding: 10,
    borderTopWidth: 1,
    borderColor: 'lightgrey',
    marginTop: 10
  },
  expandedText: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "monospace",
  },
  contactText: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "monospace"
  }
});

