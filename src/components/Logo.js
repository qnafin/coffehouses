import React from 'react';
import {
    Image,
  } from 'react-native';



const Logo = ({style}) => {
    return <Image 
                source={require("../assets/images/logo.png")}
                style={[{width: 107, height: 38}, style]}
                resizeMode={"contain"}
            />
}

export default Logo;