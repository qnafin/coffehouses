import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import i18n from '../i18n';
export default function HeaderBack({title, color, style, navigation}) {
    return (
      <View style={[styles.header, style]}>
        
        {navigation ? 
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Text  style={styles.back}>{i18n.t("back")}</Text> 
          </TouchableOpacity>
        : null }
        <Text style={[styles.title, {color: color ? color : "black"}]}>{title}</Text>
        <View/>
      </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row", 
        justifyContent: "space-between", 
        paddingLeft: 5
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