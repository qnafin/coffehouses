import React from 'react';
import {
    Image,
  } from 'react-native';



const Logo = ({style}) => {
    return <Image 
                source={require("../assets/images/logo.png")}
                style={[{width: 150, height: 40}, style]}
                resizeMode={"contain"}
            />
}

export default Logo;