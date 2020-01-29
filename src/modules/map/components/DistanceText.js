import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
  ScrollView,
  StyleSheet
} from 'react-native';

import h from "../../../api/helper";

import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import Coords from "../../../api/Coords"

class DistanceText extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
      
      };
    }

    render() {
        let  { geolocation, latitude, longitude, style } = this.props
        let distantion = (
            Coords.getHaversineDistance(
                [geolocation.latitude, geolocation.longitude], 
                [latitude, longitude]
            )/1000).toFixed(2)

        return (
            <Text style={[style]}>{h.distanceFormat(distantion)}</Text>
        )
    }
}

export default  connect(state => ({
    geolocation: state.user.geolocation
  }),
  (dispatch) => ({
    actions: {

    }
  })
  )(DistanceText);


const styles = StyleSheet.create({
    
})