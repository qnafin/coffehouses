import React from 'react';
import {
  Image,
  TouchableOpacity,
  Share,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/Colors';


export default function IconClose({style, onPress, color = "#D1D1D1"}) {
 
    return (
      <TouchableOpacity onPress={onPress} style={style} >
          <Icon name={"md-close-circle"} size={25} color={color} />
      </TouchableOpacity>
    );
  }