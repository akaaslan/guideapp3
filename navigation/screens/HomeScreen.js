import React from "react";
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ButtonWithBackground from "./../../buttonWithBackground";

export default function HomeScreen() {
    return (
      <ScrollView showsVerticalScrollIndicator={false} snapToStart ={true}>
      <View style={styles.container}>
        <StatusBar style="auto" backgroundColor='darkseagreen' />      
        <View>
          <ButtonWithBackground />
        </View>
      </View>
      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,   
      alignItems: 'left',
      justifyContent: 'top',
      paddingHorizontal : 20,
      paddingTop: 5,
    },
  
    contentContainer: {
      backgroundColor: 'darkseagreen',
      paddingTop: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      height : 40,
      width: 360,
    },
    buttonContainer: {
      paddingHorizontal: 1,
      paddingTop : 50,
      height : 500,
      width: 360,
    },
  });
