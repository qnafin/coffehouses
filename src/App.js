
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View ,Text, TouchableOpacity} from 'react-native';
import NetInfo from "@react-native-community/netinfo";


import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from './actions/index';

import AppNavigator from './navigation/AppNavigator';
import Colors from "./constants/Colors"

const ErrorLine = ({message, code}) => {
    return(
        <View style={styles.containerNoConnect}>
            
            <Text style={{textAlign: "center", color: "white"}}>
                {code ? "CODE: " + code : null}
                {message}
            </Text>
        </View>
    )
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      connect: null,
      refresh: false
    };
  }
  
  componentDidMount() {

    NetInfo.getConnectionInfo().then((connectionInfo) => {
      console.log(
         'Initial, type: ' + 
          connectionInfo.type + 
         ', effectiveType: ' + 
          connectionInfo.effectiveType);
    });
    NetInfo.addEventListener(
      'connectionChange',
      (connectionInfo) => this.handleFirstConnectivityChange(connectionInfo)
    )
  }
  
  handleFirstConnectivityChange(connectionInfo) {
    let {actions} = this.props
    actions.setConnectInfo(connectionInfo.type)
    //this.setState({connect: connectionInfo.type})
   
  }
  render() {
    let {locale} = this.state
    let {error, connect_info, actions} = this.props
    return (
      <View style={styles.container}>
        <StatusBar  backgroundColor={Colors.green} barStyle={Platform.OS == "android" ? "light-content" : "dark-content"} />
        <AppNavigator locale={locale}/>
        
        
        {connect_info == "none" ? <ErrorLine message={"Нет доступа к сети."} /> : null }
        {error ? <TouchableOpacity onPress={()=>{actions.dropError()}}>
                    <ErrorLine code={error.code} message={error.message} />
                 </TouchableOpacity> : null }

      </View>
    );
  }
  
}

export default connect(state => ({
  error: state.other.error,
  connect_info: state.other.connect_info
}),
(dispatch) => ({
  actions: bindActionCreators(Actions, dispatch)
})
)(App);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    containerNoConnect: {
      flex: 1, 
      paddingBottom: 30,
      paddingTop: 10,
      bottom: 0, 
      backgroundColor: "red",
      width: "100%", 
      position: "absolute", 
      alignItems: "center", 
      justifyContent: "center",
      opacity: 0.8
    }
  });
  