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

import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ActionsStation from '../../../actions/Station';
import * as ActionsSetting from '../../../actions/Setting';

import i18n from '../../../i18n';
import ModalContainer from "../../../components/ModalContainer"


import Layout from '../../../constants/Layout';
import Colors from '../../../constants/Colors'

import ButtonThema from "../../../components/ButtonThema"
import h from "../../../api/helper"
import ListStation from "./ListStation"

class ModalListStation extends React.Component {

    constructor(props) {
      super(props);
      this.state = { 
       
      };
      
    }
   
    componentWillUnmount() {
      let {actions} = this.props
  
    }
    componentDidUpdate(prevProps, prevState) {
        let {isVisible, geolocation, actions} = this.props
        
        if(prevProps.isVisible !== isVisible) { 
            if(isVisible === true) {
                actions.station.getStationListPage({latitude: null, longitude: null})
            } else {
              actions.setting.setStyleOverlay(false)
              actions.setting.setStyleHiddenHeader(false)
              actions.setting.setStyleHiddenSearch(false)
            }
        }
         
    }
    render() {
        let {isVisible, onClose, stations, navigation, permission_geolocation} = this.props
     

        return (
            <ModalContainer 
                isVisible={isVisible} 
                onClose={() => onClose()}
                opacity={0.8}
            >
                <ListStation 
                  data={stations} 
                  onClose={()=>onClose()} 
                  navigation={navigation} 
                  hiddenDistance={permission_geolocation ? false : true}
                  style={{height: "98%"}}
                />
                
            </ModalContainer>
        )
    }
}


export default  connect(state => ({
  stations: state.station.stations,
  permission_geolocation: state.user.permission_geolocation
}),
(dispatch) => ({
  actions: {
    station: bindActionCreators(ActionsStation, dispatch),
    setting: bindActionCreators(ActionsSetting, dispatch)
  }
})
)(ModalListStation);



const styles = StyleSheet.create({
    
})