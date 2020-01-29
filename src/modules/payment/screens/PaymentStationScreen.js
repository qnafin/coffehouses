import _ from "lodash"
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform
} from 'react-native';
import i18n from '../../../i18n';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ActionsPayment from '../../../actions/Payment';
import * as ActionsStation from "../../../actions/Station";
import * as ActionsSetting from '../../../actions/Setting';
import * as ActionsRent from "../../../actions/Rent";
import Colors from '../../../constants/Colors';
import h from "../../../api/helper";

import ApplePayButton from "../components/ApplePayButton";
import GooglePayButton from "../components/GooglePayButton";
import ThemaStyle from '../../../constants/ThemaStyle';
import ButtonWhite from "../../../components/ButtonWhite";

const IS_ANDROID = Platform.OS == "android";


class PaymentStationScreen extends React.Component {
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
    actions.setting.setStyleOverlay(true)
    actions.payment.getCards()
  }
  componentDidUpdate(prevProps, prevState) {
      
  }
  componentWillUnmount() {
    let {actions, active_marker} = this.props

    actions.setting.setStyleOverlay(false)

    actions.station.goToStation({...active_marker, timeout: 0})
  }
  render () {
    let {navigation, payment, actions, active_marker} = this.props;
    let isNextScaner = false;
    if(navigation.state.params) {
      isNextScaner = navigation.state.params.type == "Scaner"
    }
    
    return (
           <View style={styles.container}>
             <Text style={styles.description}> 
               {payment.description}
             </Text>
            {payment.cards.length == 0 
              &&
              <ButtonWhite 
                onPress={()=>{
                  navigation.navigate("CreateCard", {type: isNextScaner ? "Scaner" : "PaymentCard"})}
                }
                text={i18n.t('snap_card')} 
              />
            }
            {payment.cards.map((item, index) => {
                return <ButtonWhite 
                          key={index}
                          onPress={()=>{
                            console.log('PAYMENT CARD', item.number);
                            //TODO проверять активную ренту и открывать сканер без оплаты
                            navigation.navigate("Scaner", {"payment_type": "card"})
                            
                          }} 
                          text={`${i18n.t('pay_by_card')} *${h.formarCreditCard(item.number)}`} 
                        />
              })}
              
             {IS_ANDROID 
             ? <GooglePayButton style={styles.button}/>
             : <ApplePayButton style={styles.button}/>
             }
             
             <ButtonWhite 
                onPress={()=>{
                  navigation.goBack();
                }}
                text={i18n.t('cancel')}
                style={{fontWeight: "bold"}}
              />
           </View>
    )
  }
}


export default  connect(state => ({
  active_marker: state.coffehouses.active_marker,
  payment: state.payment
}),
(dispatch) => ({
  actions: {
    payment: bindActionCreators(ActionsPayment, dispatch),
    station: bindActionCreators(ActionsStation, dispatch),
    setting: bindActionCreators(ActionsSetting, dispatch),
    rent: bindActionCreators(ActionsRent, dispatch)
  }
})
)(PaymentStationScreen);



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: "2%",
    paddingLeft: "8%",
    paddingRight: "8%",
  },  
  button: {
    backgroundColor: "white",
    alignItems: "center",
    height: 60,
    justifyContent: "center",
    borderRadius: 30,
    marginBottom: 5
  },
  description: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20
  },
})