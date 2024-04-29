import React from "react";
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './navigation/screens/HomeScreen';
import MapScreen from './navigation/screens/MapScreen';
import SettingsScreen from './navigation/screens/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import * as Deprecated from "deprecated-react-native-prop-types";


const Tab = createBottomTabNavigator();



export default function App() {
  return (
    <NavigationContainer>
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
        
      </Tab.Navigator>
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
