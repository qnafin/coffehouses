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

import Layout from '../../../constants/Layout';
import Colors from '../../../constants/Colors'

import ButtonThema from "../../../components/ButtonThema"
import h from "../../../api/helper"
import ListStation from "./ListCoffeHouses"

import SwipeablePanel from "../../../components/swipeable_panel";

class ModalListCoffehouses extends React.Component {

    constructor(props) {
      super(props);
      this.state = { 
        swipeablePanelActive: false
      };
      
    }
    componentDidMount() {
      let {geolocation, actions} = this.props

      this.openPanel();
      actions.station.getStationListPage({latitude: null, longitude: null})
    }
    componentWillUnmount() {
  
    }
  
    openPanel = () => {
      this.setState({ swipeablePanelActive: true });
    }
    closePanel = () => {
      this.setState({ swipeablePanelActive: false });
    }
    render() {
        let { onClose, stations, navigation, permission_geolocation} = this.props
        let { swipeablePanelActive } = this.state 
        return (
          <SwipeablePanel
            fullWidth
            isActive={swipeablePanelActive}
            onClose={this.closePanel}
            openPanel={this.openPanel}
            onPressCloseButton={this.closePanel}
            style={{borderRadius: 10,}}
            noBackgroundOpacity={true}
            closeOnTouchOutside={true}
            allowFullClose={false}
            heightClose={100}
            modalFullHeight={false}
          >
            <ListStation 
              data={stations} 
              onClose={()=>{ this.closePanel()}} 
              navigation={navigation} 
              hiddenDistance={permission_geolocation ? true : true}
              style={{height: "98%", padding: "4%", marginBottom: 100}}
            /> 
          </SwipeablePanel>

        )
    }
}


export default  connect(state => ({
  stations: state.coffehouses.stations,
  permission_geolocation: state.user.permission_geolocation
}),
(dispatch) => ({
  actions: {
    station: bindActionCreators(ActionsStation, dispatch),
    setting: bindActionCreators(ActionsSetting, dispatch)
  }
})
)(ModalListCoffehouses);



const styles = StyleSheet.create({
    
})