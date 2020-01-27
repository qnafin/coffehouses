import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  StyleSheet
} from 'react-native';


import {Marker} from 'react-native-maps';
import ThemaStyle from '../../../constants/ThemaStyle'


class MarkerBulavka extends React.Component {
  constructor(props) {
    super(props);
   
  }

  getImage(marker) {
    return require("../../../assets/images/map/bulavka.png")
  }
  render() {
      let {onPress, data} = this.props
      return (
        <>
            {data.map((marker, index) => {
              return (
                <Marker
                  key={index.toString()}
                  coordinate={{
                    latitude: marker.latitude,
                    longitude: marker.longitude
                  }}
                  onPress={(e)=>{
                    let {coordinate} = e.nativeEvent
                    onPress({...coordinate});
                  }}
                >
                    <ImageBackground 
                      source={this.getImage(marker)} 
                      style={{width: 45, height: 45}}
                    >
                    </ImageBackground>
                </Marker>
            )})}
        </>
      )
      
    }
}

export default MarkerBulavka;

const styles = StyleSheet.create({
  markerText: {
    color: "white", 
    width: 42, 
    height: 25, 
    fontWeight: "bold",
    textAlign: "center", 
    paddingTop: 10
   }
})