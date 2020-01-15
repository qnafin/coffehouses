import React from 'react';
import {
    View,
    Image,
    Linking,
    TouchableOpacity
  } from 'react-native';

const config = require("../../app.json")
const socnetworkSource = {
    vk: require("../assets/images/vk.png"),
    facebook: require("../assets/images/facebook.png"),
    instagram: require("../assets/images/instagram.png"),
    youtube: require("../assets/images/youtube.png")
}
const SocnetworkItem = ({name, link}) => {
    let source = socnetworkSource[name];
    if(source && link) {
        return (
            <TouchableOpacity onPress={()=>Linking.openURL(link)}>
                <Image 
                    source={source}
                    style={[{width: 35}]}
                    resizeMode={"contain"}
                />
            </TouchableOpacity>
        )
    } else {
        return null
    }
    
}
const SocnetworkList = ({style}) => {
    if(config.socnetwork) {
        return (
            <View style={style}>
                {config.socnetwork.map((soc, index) => 
                        <SocnetworkItem name={soc.name} link={soc.link} key={index}/>
                )}
            </View>
        )
    } else {
        return null
    }
    
}

export default SocnetworkList;