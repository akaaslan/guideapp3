import * as React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Animated, LayoutAnimation, UIManager, Platform, ScrollView, Linking, Image, TextInput } from "react-native";
import { AntDesign, FontAwesome5, FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import foti from "../../icons/ben.jpg";


export default function SettingsScreen() {
  if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const [expanded, setExpanded] = React.useState({
    personalInfo: false,
    accountSettings: false,
    emergencyNumbers: false,
    appSettings: false,
  });

  const toggleExpand = (section) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded({
      ...expanded,
      [section]: !expanded[section],
    });
  };

  const [buttonText, setButtonText] = React.useState("hidden");
  const pwButtonChange = () => {
    setButtonText(buttonText === "hidden" ? "123456789" : "hidden")
  }

  const [contacts, setContacts] = React.useState([{ label: 'Emergency', number: '112' }]);
  const [newContact, setNewContact] = React.useState('');
  const [selectedCountry, setSelectedCountry] = React.useState('Turkey');

  const countryEmergencyNumbers = {
    Turkey: '112',
    USA: '911',
    UK: '999',
    Bulgaria: '150',
  };

  React.useEffect(() => {
    setContacts([{ label: 'Emergency', number: countryEmergencyNumbers[selectedCountry] }]);
  }, [selectedCountry]);

  const addContact = () => {
    if (contacts.length < 4 && newContact) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Numara eklenirken animasyonu uygula
      setContacts([...contacts, { label: `Contact ${contacts.length}`, number: newContact }]);
      setNewContact('');
    }
  };

  const deleteContact = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Numara silinirken animasyonu uygula
    const updatedContacts = [...contacts];
    updatedContacts.splice(index, 1);
    setContacts(updatedContacts);
  };

  const callContact = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };
//dark mode
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  const darkModeStyle = {
    backgroundColor: isDarkMode ? '#0e1f13' : 'white',
    color: isDarkMode ? 'white' : 'black',
  };

  return (
    <View style={[styles.container, darkModeStyle]}>
    <ScrollView contentContainerStyle={[styles.scrollViewContent, styles.container]}>
      <View>
        <View>
          <TouchableOpacity style={[styles.imageContainer, darkModeStyle]}>
            <Image
              source={foti}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <Text style={[styles.ratingText, darkModeStyle]}>
            <AntDesign name="star" size={20} color="darkslategrey" /> <AntDesign name="star" size={20} color="darkslategrey" /> <AntDesign name="star" size={20} color="darkslategrey" /> <AntDesign name="star" size={20} color="darkslategrey" /> <AntDesign name="staro" size={20} color="darkslategrey" />
          </Text>
          <Text style={[styles.nameText, darkModeStyle]}> Ahmet Kaan</Text>
          <Text style={[styles.surnameText, darkModeStyle]}> Aslan</Text>
        </View>

        <View style={[styles.sectionContainer, darkModeStyle]}>
          <Animated.View style={[styles.animatedView, darkModeStyle]}>
            <TouchableOpacity style={[styles.buttonStyle, darkModeStyle]} onPress={() => toggleExpand('personalInfo')}>
              <Text style={[styles.textStyle, darkModeStyle]}>Personal Information</Text>
              <FontAwesome6 name="person" size={24} color="black" style={[styles.iconStyle,darkModeStyle]} />
            </TouchableOpacity>
            {expanded.personalInfo && (
              <View style={[styles.expandedContent, darkModeStyle]}>
                <Text style={[styles.expandedText, darkModeStyle]}>Gender: Male</Text>
                <Text style={[styles.expandedText, darkModeStyle]}>Nationality: Turkish</Text>
                <Text style={[styles.expandedText, darkModeStyle]}>Phone Number: +905331234567</Text>
                <Text style={[styles.expandedText, darkModeStyle]}>Address: ---</Text>
              </View>
            )}
          </Animated.View>
        </View>

        <View style={[styles.sectionContainer, darkModeStyle]}>
          <Animated.View style={[styles.animatedView, darkModeStyle]}>
            <TouchableOpacity style={[styles.buttonStyle, darkModeStyle]} onPress={() => toggleExpand('accountSettings')}>
              <Text style={[styles.textStyle, darkModeStyle]}>Account Settings</Text>
              <MaterialIcons name="account-box" size={24} color="black" style={[styles.iconStyle, darkModeStyle]}/>
            </TouchableOpacity>
            {expanded.accountSettings && (
              <View style={[styles.expandedContent, darkModeStyle]}>
                <Text style={[styles.expandedContent, darkModeStyle, styles.contactText]}>E-Mail: aaslan@tu-sofia.bg</Text>
                <Text style={[styles.expandedContent, darkModeStyle, styles.contactText]}>Password: <TouchableOpacity onPress={pwButtonChange}>
                  <Text style={[styles.expandedContent, darkModeStyle, styles.contactText]}>{buttonText}</Text>
                </TouchableOpacity> </Text>
                
              </View>
            )}
          </Animated.View>
        </View>

        <View style={[styles.sectionContainer, darkModeStyle]}>
          <Animated.View style={[styles.animatedView, expanded.emergencyNumbers ? styles.expandedView : {}, darkModeStyle]}>
            <TouchableOpacity style={[styles.buttonStyle,darkModeStyle] } onPress={() => toggleExpand('emergencyNumbers')}>
            <Text style={[styles.textStyle, darkModeStyle]}>Emergency Numbers</Text>
              <FontAwesome5 name="ambulance" size={24} color="black" style={[styles.iconStyle, darkModeStyle]} />
            </TouchableOpacity>
            {expanded.emergencyNumbers && (
              <View style={[styles.expandedContent, darkModeStyle]}>
                <Text style={[styles.expandedText, darkModeStyle]}>Select Country:</Text>
                <Picker
                  selectedValue={selectedCountry}
                  onValueChange={(itemValue) => setSelectedCountry(itemValue)}
                  style={[styles.picker, darkModeStyle]}>
                  <Picker.Item label="Turkey" value="Turkey" />
                  <Picker.Item label="Bulgaria" value="Bulgaria" />
                  <Picker.Item label="USA" value="USA" />
                  <Picker.Item label="UK" value="UK" />
                </Picker>
                {contacts.map((contact, index) => (
                  <View key={index} style={[styles.contactContainer, darkModeStyle]}>
                    <Text style={[styles.contactText, darkModeStyle]}>{contact.label}: {contact.number}</Text>
                    <View style={[styles.contactButtons, darkModeStyle]}>
                      <TouchableOpacity onPress={() => callContact(contact.number)} style={styles.callButton}>
                        <Ionicons name="call-sharp" size={20} color="green" />
                      </TouchableOpacity>
                      {index > 0 && (
                        <TouchableOpacity onPress={() => deleteContact(index)} style={styles.deleteButton}>
                          <AntDesign name="delete" size={20} color="red" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}
                {contacts.length < 4 && (
                  <View style={[styles.addContactContainer, darkModeStyle]}>
                    <TextInput
                      style={[styles.textInput]}
                      placeholder="New Contact Number"
                      placeholderTextColor="darkseagreen"
                      value={newContact}
                      onChangeText={setNewContact}
                      keyboardType="phone-pad"
                    />
                    <TouchableOpacity style={styles.addButton} onPress={addContact}>
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </Animated.View>
        </View>
        
        <View style={[styles.sectionContainer, darkModeStyle]}>
          <Animated.View style={[styles.animatedView, darkModeStyle]}>
            <TouchableOpacity style={[styles.buttonStyle, darkModeStyle]} onPress={() => toggleExpand('appSettings')}>
              <Text style={[styles.textStyle, darkModeStyle]}>App Settings</Text>
              <AntDesign name="setting" size={20} color="black" style={[styles.iconStyle, darkModeStyle]} />
            </TouchableOpacity>
            {expanded.appSettings && (
              <View style={[styles.expandedContent, darkModeStyle]}>
                <Text style={[styles.expandedContent, darkModeStyle, styles.contactText]}>
                  Dark Mode: 
                </Text>      
                <TouchableOpacity onPress={toggleDarkMode} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>{isDarkMode ? "Light Mode" : "Dark Mode"}</Text>
        </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>

      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  scrollViewContent: {
    paddingBottom: 280,
    
    
  },
  // callButton: {
  //   right: 50,
  // },
  imageContainer: {
    backgroundColor: "darkseagreen",
    height: 90,
    width: 90,
    borderRadius: 45,
    marginLeft: 20,
    marginTop: 20,
  },
  profileImage: {
    height: 90,
    width: 90,
    borderRadius: 45,
    alignSelf: "center",
  },
  ratingText: {
    left: 7,
  },
  nameText: {
    fontFamily: "monospace",
    fontWeight: "bold",
    fontSize: 32,
    position: "absolute",
    left: 120,
    top: 25,
  },
  surnameText: {
    fontFamily: "monospace",
    fontWeight: "bold",
    fontSize: 32,
    position: "absolute",
    left: 120,
    top: 65,
  },
  sectionContainer: {
    marginTop: 20,
  },
  animatedView: {
    overflow: "hidden",
    alignSelf: "center",
    width: '95%',
    borderColor: "lightgrey",
    borderWidth: 2,
    borderRadius: 20,
    backgroundColor: 'white', // Arka plan rengi eklendi
  },
  buttonStyle: {
    overflow: "hidden",
    width: 350,
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignSelf: "center",
    // marginTop: 10,
    backgroundColor: 'white', // Arka plan rengi eklendi
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
  expandedView: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  expandedContent: {
    padding: 10,
  },
  expandedText: {
    fontSize: 14,
    fontFamily: "monospace",
    fontWeight: "bold",
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: 300,
    alignSelf: 'center',
  },
  contactContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  contactText: {
    fontSize: 14,
    fontFamily: "monospace",
    fontWeight: "bold",
  },
  deleteButton: {
    position: "absolute",
    right: 40
  },
  addContactContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 10,
    padding: 5,
    width: '70%',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "green",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  addButtonText: {
    color: "white",
    fontFamily: "monospace",
    fontWeight: "bold",
  },
  passwordText: {
    // top:4,
    fontSize: 14,
    fontFamily: "monospace",
    fontWeight: "bold",
    color:"grey",
  },
  toggleButton: {
    backgroundColor: "darkgreen",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: "center",
    alignItems: "center",
    position: "absolute",
    top: 10,
    height: 33,
    width: 130,
    right: 20,
  },
  toggleButtonText: {
    color: "white",
    fontFamily: "monospace",
    fontWeight: "bold",
    alignItems: "center"
  },
});
