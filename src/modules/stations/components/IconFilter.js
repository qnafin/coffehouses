import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';


import ThemaStyle from '../../../constants/ThemaStyle'


const IconFilter = ({style, onPress}) => {
    return (
      <TouchableOpacity 
        onPress={onPress}
        style={style}
      >
        <View style={[styles.rondoButton, styles.shadow, {backgroundColor: "white"}]}>
          <View style={{
                backgroundColor: "#F8F8F8", 
                borderRadius: 20, 
                width: 22, 
                height: 22,  
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center"            
            }}>
            <Image 
                style={{width: 16, height: 16}} 
                resizeMode={"contain"} 
                source={require("../../../assets/images/icon/bulleted-list.png")}
            />
          </View>
        </View>
    </TouchableOpacity>
    )
}

export default IconFilter;
const styles = StyleSheet.create({
  shadow: ThemaStyle.shadow,
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