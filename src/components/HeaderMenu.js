import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
} from 'react-native';

import i18n from '../i18n';
import IconMenu from "../components/IconMenu"
import Logo from "../components/Logo"

export default function HeaderMenu({title, color, style, navigation, logo, rightButtton}) {
 
    return (
      <View style={[styles.header, style]}>
        <IconMenu navigation={navigation}/>
        {logo && <Logo style={{marginRight: 10}}/>}
        {title && <Text style={[styles.title, {color: color ? color : "black"}]}>{title}</Text>}
        
        {rightButtton ? rightButtton : <View style={{width: 40}}/>}
        
        
      </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center",
        alignContent: "center",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: (Platform.OS == "ios") ? 40 : 20,
        backgroundColor: "white",
        paddingBottom: 15,
        borderBottomLeftRadius: 45,
        borderBottomRightRadius: 45
    },
    back: {
      color: "#4D4D4D"
    },
    title: {
      color: "white",
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      paddingBottom: 30,
  },
  });