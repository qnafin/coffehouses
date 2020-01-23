import React, {Component} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ZoomButtons = ({style, onMinus, onPlus}) => {
    return (
      <View style={[style, styles.container]}>
          <TouchableOpacity 
            onPress={()=>{onPlus()}}>
            <Text style={[styles.button, styles.plus]}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={()=>{onMinus()}}>
            <Text style={[styles.button, styles.minus]}>—</Text>
          </TouchableOpacity>
      </View>
    )
}

export default ZoomButtons

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    overflow: "hidden", 
    borderRadius: 10
  },
  button: {
    width: 40,
    height: 45,
    textAlign: "center",
    backgroundColor: "white"
  },
  minus: {
    fontSize: 18, 
    paddingTop: 10,
    fontWeight: "bold"
  },
  plus: {
    fontSize: 35
  }
})
  