import React from "react";
import {Animated, View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity} from "react-native";
import {AntDesign, Entypo, FontAwesome5, Feather} from "@expo/vector-icons";


export default class ActionButton extends React.Component {
    animation = new Animated.Value(0)

    toggleMenu = () => {
        const toValue = this.open ? 0:1

        Animated.spring(this.animation, {
            toValue,
            friction: 5,
            useNativeDriver: true,
        }).start();

        this.open = !this.open;
    };
    render() {
        const searchStyle = {
            transform: [
                {scale: this.animation},
                {
                    translateX: this.animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-5, -65]
                    })
                }
            ]
        }
        const heartStyle = {
            transform: [
                {scale: this.animation},
                {
                    translateX: this.animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-65, -125]
                    })
                }
            ]
        }
        const routeStyle = {
            transform: [
                {scale: this.animation},
                {
                    translateX: this.animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-125, -185]
                    })
                }
            ]
        }
        const settingsStyle = {
            transform: [
                {scale: this.animation},
                {
                    translateX: this.animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-185, -245]
                    })
                }
            ]
        }
        const rotation = {
            transform: [ {
                rotate : this.animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "180deg"]
                })
                
            }
            ]
        }
        return (
            <View style= {[styles.container, this.props.style]}>
                <TouchableWithoutFeedback onPress = {this.props.openModal1}>
                <Animated.View style = {[styles.button, styles.secondary,routeStyle]}>
                    <FontAwesome5 name="route" size={24} color="darkseagreen" />
                </Animated.View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress = {this.props.openModal2}>
                <Animated.View style = {[styles.button, styles.secondary,heartStyle]}>
                    <AntDesign name="hearto" size={24} color="darkseagreen" />
                </Animated.View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress = {this.props.openModal3}>
                <Animated.View style = {[styles.button, styles.secondary,searchStyle]}>
                    <AntDesign name="search1" size={24} color="darkseagreen" />
                </Animated.View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress = {this.props.openModalSettings}>
                    <Animated.View style = {[styles.button, styles.secondary, settingsStyle]}>
                        <AntDesign name="setting" size={24} color="darkseagreen" />
                    </Animated.View>
                    </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress = {this.toggleMenu}>
                <Animated.View style = {[styles.button, styles.menu, rotation]}>
                    <Feather name="arrow-left" size={24} color="#FFF" />
                </Animated.View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        position: "absolute",
    },
    button: {
        position: "absolute",
        width: 60,
        height:60,
        borderRadius: 60/2,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "darkseagreen",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 20,
    },
    menu: {
        backgroundColor: "darkseagreen",
        shadowColor: "darkseagreen",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 20,
    },
    secondary: {
        width: 48,
        height: 48,
        borderRadius: 48/2,
        backgroundColor: "#FFF",
        top: 7
    }

})