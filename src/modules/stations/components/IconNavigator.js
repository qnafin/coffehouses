import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';


import Colors from '../../../constants/Colors'


const IconNavigator = ({style, onPress, isFollow}) => {
    return (
      <TouchableOpacity 
        onPress={onPress}
        style={style}
      >
        <View style={[styles.rondoButton, styles.shadow, {backgroundColor: "white"}]}>
          <View style={{
                backgroundColor: "#fff", 
                borderRadius: 48, 
                width: 48, 
                height: 48,  
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center"            
            }}>
            <Image 
                style={
                  isFollow 
                  ? { 
                      width: 20, 
                      height: 20, 
                      top: 3, 
                      transform: [{ rotate: "-45deg" }]
                    } 
                  : { width: 20, height: 20 }} 
                resizeMode={"contain"} 
                source={require("../../../assets/images/map/naviagator.png")}
            />
          </View>
        </View>
    </TouchableOpacity>
    )
}

export default IconNavigator;

const styles = StyleSheet.create({
  shadow: { borderWidth: 1, borderColor: "#ececec"}, //ThemaStyle.shadow,
  text: {
    fontWeight: "bold"
  },  
  rondoButton: {
    width: 40,
    height: 40,
    borderRadius: 48,
    alignContent: "center",
    justifyContent: 'center',
    alignItems: "center",
  }
})