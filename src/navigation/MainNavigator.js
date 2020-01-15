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

import PaymentScreen from '../modules/payment/screens/PaymentScreen';
import PaymentStationScreen from "../modules/payment/screens/PaymentStationScreen";
import CreateCardScreen from "../modules/payment/screens/CreateCardScreen";
import AcceptAPayScreen from "../modules/payment/screens/AcceptAPayScreen";
import AcceptGPayScreen from "../modules/payment/screens/AcceptGPayScreen";
import ChecksScreen from "../modules/payment/screens/ChecksScreen";

import PersonalScreen from '../modules/personal/screens/PersonalScreen';
import MapScreen from '../modules/stations/screens/MapScreen';
import ScanerScreen from '../modules/stations/screens/ScanerScreen';
import StationListScreen from '../modules/stations/screens/StationListScreen';
import SearchScreen from '../modules/stations/screens/SearchScreen';


import HeaderDrawerMenu from "../components/HeaderDrawerMenu"
import IconDrawerMenu from "../components/IconDrawerMenu";
import SocnetworkList from "../components/SocnetworkList"
import Colors from "../constants/Colors";
import {isSmallDevice} from "../constants/Layout"
import ThemaStyle from '../constants/ThemaStyle'

const StaionsStack = createStackNavigator(
  {
    Map: MapScreen,
    Scaner: {
      screen: ScanerScreen,
      params: { payment_type: "card" }
    },
    StationList: StationListScreen,
    Search: SearchScreen,
    PaymentStation: PaymentStationScreen,
    CreateCard: {
      screen: CreateCardScreen,
      params: { type: "PaymentCard" }
    },
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

StaionsStack.navigationOptions = () => {
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

const PaymentStack = createStackNavigator(
  {
    Payment: PaymentScreen,
    PaymentCreateCard: {
      screen: CreateCardScreen,
      params: { type: "SnapCard" }
    },
    Checks: {
      screen: ChecksScreen,
      params: { rent_id: null }
    },
    AcceptAPay: AcceptAPayScreen,
    AcceptGPay: AcceptGPayScreen
  }
);

const Payment = ({payment}) => {
  console.log('payment', )
  let strCard = null;
  if(payment.cards.length > 0) {
    strCard = `${payment.cards[0].type} *${h.formarCreditCard(payment.cards[0].number)}`
  }
  return <View style={{paddingLeft: 35,  }}>
            <Text style={{fontSize: ThemaStyle.fontSize17, color: Colors.black}}>{i18n.t("payment")}</Text>
            {strCard && <Text style={{color: Colors.green}}>{strCard}</Text>}
        </View>
}
const PaymentLabel = connect(state => ({
  payment: state.payment
}),
(dispatch) => ({
  actions: {
    payment: bindActionCreators(ActionsPayment, dispatch),
  }
})
)(Payment);

PaymentStack.navigationOptions = () => {
  return {
    drawerLabel: <PaymentLabel/>,
    drawerIcon: ({ focused }) => (
      <IconDrawerMenu source={require('../assets/images/menu/credit-card.png')} />
    )
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
  StaionsStack,
  PaymentStack,
  CompanyStack,
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
