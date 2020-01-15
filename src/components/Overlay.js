import React from 'react';
import {
    View,
  } from 'react-native';



const Overlay = ({style}) => {
    return <View style={{backgroundColor: "rgba(0,0,0, 0.7)", flex: 1, height: "200%", width: "100%", position: "absolute", bottom: 0, top: 0}}/>
}

export default Overlay;