import React from "react";
import { StyleSheet, TouchableOpacity, Alert, Button, Text, Image, Modal, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './navigation/screens/HomeScreen';
import MapScreen from './navigation/screens/MapScreen';
import SettingsScreen from './navigation/screens/SettingsScreen';
import TestScreen from "./navigation/screens/TestScreen";
import locations from "./Locations";
import { DarkModeProvider } from "./DarkModeContext";
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Deprecated from "deprecated-react-native-prop-types";


const Tab = createBottomTabNavigator();



export default function App() {
  
  return (
    <NavigationContainer>
      <DarkModeProvider>
      <Tab.Navigator
        screenOptions={{
          tabBarInactiveBackgroundColor: "darkseagreen",
          tabBarActiveTintColor: "black",
          tabBarActiveBackgroundColor: "darkgreen",
          tabBarLabelPosition: "beside-icon",
          tabBarStyle: {
            height: 60,
            position: "absolute",
            bottom: 16,
            right: 16,
            left: 16,
            borderRadius: 20,
            overflow: "hidden"
          },
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            headerRightContainerStyle: {
              marginRight: 10  
            },
            title: 'GuideApp',  
            headerStyle: {
              backgroundColor: "darkseagreen",
            },
            headerTitleStyle: {
              fontFamily: 'monospace',
              fontWeight: "bold"
            },
            tabBarLabel: 'Home',  
            tabBarIcon: () => <Ionicons name="home" size={24} />,    
            tabBarLabelStyle: {
              fontFamily: 'monospace',
              fontWeight: "bold"
            },
          }}
        />
        <Tab.Screen 
          name="Map" 
          component={MapScreen} 
          options={{
            title: 'GuideApp',
            headerStyle: {
              backgroundColor: "darkseagreen",
            },
            headerTitleStyle: {
              fontFamily: 'monospace',
              fontWeight: "bold"
            },
            tabBarLabel: 'Maps', 
            tabBarIcon: () =>  <Entypo name="map" size={24} />,    
            tabBarLabelStyle: {
              fontFamily: 'monospace',
              fontWeight: "bold"
            }
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{
            title: 'GuideApp',
            headerStyle: {
              backgroundColor: "darkseagreen",
            },
            headerTitleStyle: {
              fontFamily: 'monospace',
              fontWeight: "bold"
            },
            tabBarLabel: 'Profile', 
            tabBarIcon: () =>  <FontAwesome5 name="portrait" size={24} color="black" />,    
            tabBarLabelStyle: {
              fontFamily: 'monospace',
              fontWeight: "bold",
            }
          }}
        />
        
        {/* <Tab.Screen
        name = "test"
        component={TestScreen}
        options = {{
          title: "GuideApp",
          headerStyle: {
            backgroundColor: "darkseagreen",
          },
          headerTitleStyle: {
            fontFamily: 'monospace',
            fontWeight: "bold"
          },
          tabBarLabel: 'Test', 
          tabBarIcon: () =>  <FontAwesome5 name="test" size={24} color="black" />,    
          tabBarLabelStyle: {
            fontFamily: 'monospace',
            fontWeight: "bold",
          }
        }}
        /> */}
      </Tab.Navigator>
      </DarkModeProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,   
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
});
