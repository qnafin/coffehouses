import React from 'react';
import {
    View,
    Platform,
    TouchableOpacity
  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function IconChecked({navigation, style, color}) {
  return (
    <TouchableOpacity style={[{top: 0, left: 10, width: 30, height: 30}, style ]} onPress={()=>navigation.goBack()}>
        <Ionicons 
          name= {Platform.OS === 'ios' ? "ios-arrow-back" :  "md-arrow-back"} 
          size={30} 
          color={color ? color : "black"} 
        />
    </TouchableOpacity>
  );
}
