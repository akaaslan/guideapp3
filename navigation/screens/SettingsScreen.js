import * as React from "react";
import { StyleSheet, View, Text, Switch } from "react-native";

export default function SettingsScreen() {
    return (
        <View>
            <Text
            style = {{
                fontSize: 20,
                textAlign: "center",
                marginTop: 200,
                fontFamily: "monospace",
                fontWeight: "bold"
            }}>Settings</Text>
        </View>
    )
}