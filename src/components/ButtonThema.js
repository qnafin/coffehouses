import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import Colors from "../constants/Colors"
import LinearGradient from 'react-native-linear-gradient';
import ThemaStyle from '../constants/ThemaStyle';

const ButtonThema = ({disabled, style, onPress, text, color, loading}) => {
  return (
    <TouchableOpacity
      disabled={disabled || loading}
      style={[{width: "100%"}]}
      onPress={() => onPress()}>
      <LinearGradient
        colors={disabled ? ["#F8F8F8", "#F8F8F8"] : Colors.greenGradient}
        style={[styles.button, style]}
      >
        {loading && (
          <ActivityIndicator size="small" color="#ffffff" style={styles.spinner} />
        )}
        <Text style={[styles.button_text, disabled ? {color: "#e2e2e2"} : null]}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>

  )
}
export default ButtonThema;
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#6F4CFF",
    borderRadius: 50,
    height: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    color: "white",
    width: "100%",
    alignItems: "center"
  },
  disabled: {
    backgroundColor: "#F8F8F8"
  },
  button_text: {
    color: "white",
    fontSize: ThemaStyle.fontSize17,
    textAlign: "center",
    fontWeight: "bold",
  },
  spinner: {
    marginRight: 5,
  }
});
