import React from 'react';
import { ScrollView , View, Text, StyleSheet} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import SafeAreaView from 'react-native-safe-area-view';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';

import i18n from '../i18n';

import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ActionsPayment from '../actions/Payment';
import h from "../api/helper"

import CompanyScreen from '../modules/company/screens/CompanyScreen';

import PersonalScreen from '../modules/personal/screens/PersonalScreen';
import MapScreen from '../modules/map/screens/MapScreen';
import SearchScreen from '../modules/map/screens/SearchScreen';


import HeaderDrawerMenu from "../components/HeaderDrawerMenu"
import IconDrawerMenu from "../components/IconDrawerMenu";
import Colors from "../constants/Colors";
import {isSmallDevice} from "../constants/Layout"
import ThemaStyle from '../constants/ThemaStyle'

const MapStack = createStackNavigator(
  {
    Map: MapScreen,
    Search: SearchScreen,
  },
  {
    mode: 'modal',
    headerMode: 'none',
    transparentCard: true,
    cardStyle:{
      backgroundColor:"transparent",
      opacity: 0.99
  }
  }
);

MapStack.navigationOptions = () => {
  return {
    drawerLabel: () => null
  }
};

const PersonalStack = createStackNavigator(
  {
    Personal: PersonalScreen,
  }
);

PersonalStack.navigationOptions = () => {
  return {
    drawerLabel: () => null
  }
};

const CompanyStack = createStackNavigator(
  {
    Company: CompanyScreen,
  }
);

CompanyStack.navigationOptions = () => {
  return {
    drawerLabel: i18n.t("company"),
    drawerIcon: ({ focused }) => (
      <IconDrawerMenu source={require('../assets/images/menu/handshake-heart.png')} />
    ),
  }
};

const CustomDrawerContentComponent = (props) => (
  <ScrollView contentContainerStyle={{flex: 1}}>
    <View style={{
            flexDirection: "column", 
            flex: 1, 
            justifyContent: "space-between",  
      }}>
      <View>
        <HeaderDrawerMenu onPress={()=>{
              props.navigation.navigate("PersonalStack")
              props.navigation.closeDrawer()
          }}/>
      </View>
      
        <SafeAreaView 
            style={{ 
              flex: 1,
              justifyContent: "space-around",
            }} 
            forceInset={{  horizontal: 'never',  }}>
          <DrawerItems {...props} />
        </SafeAreaView>
        
    </View>
  </ScrollView>
);

const drawerNavigator = createDrawerNavigator({
  MapStack,
  PersonalStack
}, {
  contentComponent: CustomDrawerContentComponent,
  overlayColor: "rgba(0, 0, 0, 0.1)",
  contentOptions: {
    activeTintColor: Colors.theme,
    inactiveTintColor: "#4C4B5E",
    activeBackgroundColor: null,
    itemStyle: {
      height: 52
    },
    labelStyle: {
      fontSize: ThemaStyle.fontSize17,
      fontWeight: "normal",
      color: Colors.black,
      paddingLeft: 20, 
    },
    iconContainerStyle: {
      opacity: 1,
      marginLeft: 0,
      marginRight: 0,
      paddingLeft: "12%"
    }
  }
});



export default drawerNavigator;
