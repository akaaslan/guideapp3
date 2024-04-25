import * as React from "react";
import { View } from "react-native";

// Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { IoHomeOutline } from "react-icons/io5";

// Screens
import MapScreen from "./screens/MapScreen";
import HomeScreen from "./screens/HomeScreen";

//Screen Names
const homeName = "Home";
const mapName = "Map";

const Tab = createBottomTabNavigator();

export default function MainContainer() {
    return (
        <View></View>
    )
}