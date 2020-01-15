import _ from "lodash"
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Platform
} from 'react-native';
import i18n from '../../../i18n';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ActionsStation from '../../../actions/Station';
import * as ActionsSetting from '../../../actions/Setting';
import Colors from '../../../constants/Colors'

import ThemaStyle from '../../../constants/ThemaStyle'
import ModalScreenContainer from "../../../components/ModalScreenContainer";

import ListStation from "../components/ListStation"

class StationListScreen extends React.Component {
  //Используется только в IOS, Android использует ModalListStation
  constructor(props) {
    super(props);
    this.state = { 
    };
  }
  
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    }
  };
  componentDidMount() {
    let {actions} = this.props
    actions.station.getStationListPage({latitude: null, longitude: null})
  }
  componentDidUpdate(prevProps, prevState) {
      
  }
  componentWillUnmount() {
    let {actions} = this.props

    actions.setting.setStyleHiddenSearch(false)
    actions.setting.setStyleOverlay(false)
    actions.setting.setStyleHiddenHeader(false)
  }
  render () {
    let {stations, navigation, permission_geolocation} = this.props
    
    return (
        <ModalScreenContainer>
            <ListStation data={stations} navigation={navigation} hiddenDistance={permission_geolocation ? false : true}/>
        </ModalScreenContainer>
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
)(StationListScreen);



const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: "#f8f8f8"
  },  
  contentContainer: {
      paddingTop: ThemaStyle.paddingTopStatic,
      paddingLeft: "8%",
      paddingRight: "8%",
      flexGrow: 1
  },
})