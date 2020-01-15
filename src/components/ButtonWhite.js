import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import Colors from "../constants/Colors"
import ThemaStyle from '../constants/ThemaStyle'

const ButtonWhite = ({children, onPress, text, style, shadow, height}) => {
  return(
    <TouchableOpacity onPress={onPress ? onPress : ()=>{}}>
      <View style={[styles.button, shadow ? styles.shadow : null, height ? {height : height} : null]}>
        {children}
        {text && <Text style={[styles.textButton, style]}>{text}</Text> }
      </View>
    </TouchableOpacity>
  )
}

export default ButtonWhite;

const styles = StyleSheet.create({
  shadow: ThemaStyle.shadow,
  button: {
    backgroundColor: "white",
    alignItems: "center",
    height: 60,
    justifyContent: "center",
    borderRadius: 30,
    marginBottom: 5
  },
  textButton: {
    color: Colors.green,
    fontSize: 18
  }
});
