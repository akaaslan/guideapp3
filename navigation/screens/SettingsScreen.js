import * as React from "react";
import { StyleSheet, View, Text } from "react-native";

export default function SettingsScreen() {
    return (
        <View>
            <Text
            style = {{
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
                marginTop: 200,
                fontFamily: "monospace",
                fontWeight: "Bold"
            }}>Settings</Text>
        </View>
    )
}