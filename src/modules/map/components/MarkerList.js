import React from 'react';
import {
  Text,
  View,
  Platform,
  ImageBackground,
  StyleSheet
} from 'react-native';


import {Marker} from 'react-native-maps';
import ThemaStyle from '../../../constants/ThemaStyle'


class MarkerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      image: {
        marker: require("../../../assets/images/map/marker.png"),
        selected: require("../../../assets/images/map/marker-selected.png"),
      },
    }
  }
  
 
  renderImage(marker) {
    let {image} = this.state
    let {activeMarkerID} = this.props
    if(marker.id == activeMarkerID ) {
      return  <ImageBackground 
                source={image.selected} 
                style={{width: 40, height: 52}}
              />
    } else {
      return <ImageBackground 
                source={image.marker} 
                style={{width: 40, height: 52}}
              />
    }
  }
  render() {
      let {data, onPress, isRent} = this.props
      let {activeMarkerID} = this.props
      return (
        <>
            {data.map(marker => {
              let isSelected = marker.id == activeMarkerID && marker.active
              return (
                <Marker
                  key={marker.id}
                  coordinate={{
                    latitude: marker.coordinates.lat,
                    longitude: marker.coordinates.lon
                  }}
                  onPress={(e)=>{
                    let {coordinate} = e.nativeEvent
                    onPress({...coordinate, idStation: marker.id});
                  }}
                >
                    {this.renderImage(marker)}
                </Marker>
            )}
            )}
        </>
      )
      
    }
}

export default MarkerList;

const styles = StyleSheet.create({
  markerText: {
    color: "white", 
    width: Platform.OS == "ios" ? 42 : 45, 
    height: 25, 
    fontWeight: "bold",
    textAlign: "center", 
    paddingTop: 10
   }
})