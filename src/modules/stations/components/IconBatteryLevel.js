import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  NativeModules,
  DeviceEventEmitter,
  StyleSheet
} from 'react-native';

const BatteryManager = NativeModules.BatteryManager


import ThemaStyle from '../../../constants/ThemaStyle'


class IconBatteryLevel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      batteryLevel: 25, 
      charging:false
    };
  }

  onBatteryStatus(info){
    //this.setState({batteryLevel: info.level});
    //this.setState({charging: info.isPlugged});
  }

  componentDidMount(){
    BatteryManager.updateBatteryLevel(function(info){
      this._subscription = DeviceEventEmitter.addListener('BatteryStatus', this.onBatteryStatus);
      this.setState({batteryLevel: info.level});
      this.setState({charging: info.isPlugged});
    }.bind(this));
  }

  

  render() {
    let { batteryLevel} = this.state
    //console.log('batteryLevel', batteryLevel)
    let image = require("../../../assets/images/map/battery-25.png");
    if(batteryLevel > 33 && batteryLevel < 51) {
        image = require("../../../assets/images/map/battery-50.png");
    }
    if(batteryLevel >= 51 && batteryLevel <= 80) {
        image = require("../../../assets/images/map/battery-75.png");
    } 
    if(batteryLevel > 80) {
        image = require("../../../assets/images/map/battery-100.png");
    } 
   
    let {style} = this.props
    return (
      <Image source={image} style={{width: 16, height: 16, left: 7, right: 7}}/>
    )
  }
}


export default IconBatteryLevel;

const styles = StyleSheet.create({
  
})