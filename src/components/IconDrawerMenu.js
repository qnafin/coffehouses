import React from 'react';
import {
  Image,
} from 'react-native';

const IconDrawerMenu = ({source}) => {
  return <Image source={source}
            style={{width: 25}}
            resizeMode={"contain"}
          />
}

export default IconDrawerMenu