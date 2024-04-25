import React from "react";
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './navigation/screens/HomeScreen';
import MapScreen from './navigation/screens/MapScreen';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
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
      tabBarIcon: () => <Ionicons name="home" size={24} color="black" />,    
      tabBarLabelStyle: {
        fontFamily: 'monospace',
        
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
      tabBarIcon: () =>  <Entypo name="map" size={24} color="black" />,    
      tabBarLabelStyle: {
        fontFamily: 'monospace',
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
