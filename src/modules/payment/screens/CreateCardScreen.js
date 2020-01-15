import _ from "lodash"
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Platform
} from 'react-native';
import { WebView } from 'react-native-webview';

import i18n from '../../../i18n';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ActionsPayment from '../../../actions/Payment';
import * as ActionsSetting from '../../../actions/Setting';
import * as ActionsRent from "../../../actions/Rent";
import Colors from '../../../constants/Colors'
import TitlePageBack from "../../../components/TitlePageBack"
import ButtonThema from "../../../components/ButtonThema"
import ThemaStyle from '../../../constants/ThemaStyle';
import TextInputThema from "../../../components/TextInputThema";
import h from "../../../api/helper";

class CreateCardScreen extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { 
      card_number: null,
      card_expiration_date: null,
      card_cvv: null,
      card_name: null,
      validateInputs: {
        card_number: null,
        card_expiration_date: null,
        card_cvv: null,
        card_name: null
      },
      form_validating: false
    };
    let {navigation} = this.props
    if(navigation.state.params) {
      this.isNextScaner = navigation.state.params.type == "Scaner"
    }
    this.IS_PAYMENT = navigation.state.params.type == "PaymentCard" || navigation.state.params.type == "Scaner";
  }
  
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    }
  };
  componentDidMount() {
    let {actions} = this.props
    let {navigation, now_snap_card} = this.props

    if(now_snap_card) {
      navigation.goBack()
    }
  }
  componentWillUnmount() {
    let {actions} = this.props
    console.log('componentWillUnmount')
    actions.payment.dropLink3DS()
  }
  componentDidUpdate(prevProps, prevState) {
      let {
        card_number, 
        card_expiration_date, 
        card_cvv, 
        card_name,
        form_validating,
      } = this.state;
      let {navigation, now_snap_card, payment, actions} = this.props
      if(form_validating) {
        if(prevState.card_number !== card_number) { 
          this._validateCardNumber()
        }
        if(prevState.card_expiration_date !== card_expiration_date) { 
          this._validateCardExpirationDate()
        }
        if(prevState.card_cvv !== card_cvv) { 
          this._validateCardCVV()
        }
        if(prevState.card_name !== card_name) { 
          this._validateCardName()
        }
        
      }
      if(payment.success && prevProps.payment.success !== payment.success) { 
        //Карта привязана
        navigation.goBack()
        if(this.IS_PAYMENT) {
          navigation.navigate("Scaner", {"payment_type": "card"})
          actions.payment.dropLink3DS()
        }
        
      }
      // if(prevProps.now_snap_card !== now_snap_card) { 
      //   //navigation.goBack()
      // }
  }
  componentWillUnmount() {
    let {actions} = this.props

  }
  _validateCardNumber() {
    let {card_number, validateInputs} = this.state
    let validate = h.validateCardNumber(card_number);
    this.setState({
      validateInputs: {
        ...validateInputs,
        card_number: validate
      }
    })
    return validate
  }
  _validateCardExpirationDate() {
    let {card_expiration_date, validateInputs} = this.state
    let validate = (card_expiration_date && card_expiration_date.length == 5) ? true : false;
    if(validate) {
      let expDate = card_expiration_date.split("/");
      let date = new Date()
      validate = new Date(`${date.getFullYear()}-${h.parserDate(date).month}-01`) <= new Date(`20${expDate[1]}-${expDate[0]}-01`)
      
    }

    this.setState({
      validateInputs: {
        ...validateInputs,
        card_expiration_date: validate
      }
    })
    return validate
  }
  _validateCardCVV() {
    let {card_cvv, validateInputs} = this.state
    let validate = (card_cvv && card_cvv.length == 3) ? true : false
    this.setState({
      validateInputs: {
        ...validateInputs,
        card_cvv: validate
      }
    })
    return validate
  }
  _validateCardName() {
    let {card_name, validateInputs} = this.state
    let validate = (card_name && card_name.length > 2 && h.isLatinStr(card_name)) ? true : false
    this.setState({
      validateInputs: {
        ...validateInputs,
        card_name: validate
      }
    })
    return validate
  }
  _validateInputs() {
    let {validateInputs} = this.state
    
    validateInputs.card_expiration_date = this._validateCardExpirationDate()
    validateInputs.card_number = this._validateCardNumber()
    validateInputs.card_cvv = this._validateCardCVV()
    validateInputs.card_name = this._validateCardName()
    this.setState({validateInputs})

    return validateInputs.card_cvv && validateInputs.card_number && validateInputs.card_expiration_date
  }
  _onPressPayment() {
    let {actions, navigation, active_marker} = this.props
    this.setState({form_validating: true})
    
    if(this._validateInputs()) {
      console.log('SEND _onPressPayment')
      let { card_number, card_expiration_date, card_cvv, card_name } = this.state
      let {now_snap_card} = this.props
      if(!now_snap_card) {
        actions.payment.createCard({
          number: card_number, 
          cvv: card_cvv, 
          date: card_expiration_date,
          name: card_name
        })
      }
    }
  }
  _onPressSnapCard() {
    let {actions, navigation} = this.props
    this.setState({form_validating: true})
    if(this._validateInputs()) {
      let { card_number, card_expiration_date, card_cvv, card_name } = this.state
      actions.payment.createCard({
        number: card_number, 
        cvv: card_cvv, 
        date: card_expiration_date,
        name: card_name
      })
    }
  }
  render () {
    let {validateInputs, card_cvv, card_expiration_date, card_name, card_number} = this.state
    let {navigation, payment} = this.props
    if(payment.secure_3ds_url) {
      return (
        <KeyboardAvoidingView style={[styles.container]} behavior={Platform.OS === "ios" ? "padding" : false} enabled>
          <View style={styles.contentContainer}>
                <TitlePageBack name={i18n.t('come_back')} 
                        onPress={()=>{
                          let {actions} = this.props
                          actions.payment.dropLink3DS()
                        }} 
                        navigation={navigation}
                />
                <WebView source={{ uri: payment.secure_3ds_url }} />
           
          </View>
        </KeyboardAvoidingView>
      )
    }
    
    return (
      <KeyboardAvoidingView style={[styles.container]} behavior={Platform.OS === "ios" ? "padding" : false} enabled>
        <View style={styles.contentContainer}>
            <View>
                  <TitlePageBack name={i18n.t('come_back')} 
                        onPress={()=>{navigation.goBack()}} 
                        navigation={navigation}
                  />
                  <Text style={styles.title}>{i18n.t("link_card_for_payment")}</Text>

                  <TextInputThema 
                    type={'credit-card'}
                    masked={true}
                    autoFocus={true}
                    keyboardType={"phone-pad"}
                    options={{
                      maskType: 'BRL',
                      withDDD: true,
                      dddMask: '9999 9999 9999 9999'
                    }}
                    value={card_number}
                    error={validateInputs.card_number === false}
                    placeholder={""}
                    label={i18n.t("enter_card_number")}
                    errorLabel={i18n.t('invalid_card_number')}
                    onChangeText={text => {
                      this.setState({card_number: text})
                      return text
                    }}
                  />
                  <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <View style={{width: "45%"}}>
                      <TextInputThema 
                        type={'cel-phone'}
                        masked={true}
                        autoFocus={false}
                        keyboardType={"phone-pad"}
                        value={card_expiration_date}
                        maxLength={5}
                        options={{
                          maskType: 'BRL',
                          withDDD: true,
                          dddMask: '99/99'
                        }}
                        error={validateInputs.card_expiration_date === false}
                        placeholder={i18n.t("mm_yy")}
                        label={i18n.t("validity_of_MM_YY")}
                        errorLabel={i18n.t('invalid_card_date')}
                        onChangeText={text => {
                          this.setState({card_expiration_date: text})
                          return text
                        }}
                      />
                    </View>
                    <View style={{width: "45%"}}>
                      <TextInputThema 
                        masked={false}
                        autoFocus={false}
                        keyboardType={"phone-pad"}
                        value={card_cvv}
                        maxLength={3}
                        error={validateInputs.card_cvv === false}
                        placeholder={"CVV/CVC"}
                        label={i18n.t("cvv_cvc")}
                        errorLabel={i18n.t('invalid_cvv')}
                        onChangeText={text => {
                          this.setState({card_cvv: text})
                          return text
                        }}
                      />
                    </View>
                </View>
                <TextInputThema 
                    masked={false}
                    keyboardType={"default"}
                    error={validateInputs.card_name === false}
                    placeholder={""}
                    value={card_name}
                    label={i18n.t("card_name")}
                    errorLabel={i18n.t('invalid_card_name')}
                    onChangeText={text => {
                      this.setState({card_name: text.toUpperCase()})
                      return text.toUpperCase();
                    }}
                  />
            </View>
            <Text style={styles.error_text}>
              {payment.error}
            </Text>
            <View style={styles.footer}>
              {this.IS_PAYMENT 
              ? (
                <View>
                    <ButtonThema 
                        style={{height: 60}} 
                        onPress={()=>{this._onPressPayment()}} 
                        text={i18n.t("pay_charger")} 
                    />
                    <Text style={styles.description}> 
                        {payment.description}
                    </Text>
                </View>  
              )
              :
              <ButtonThema 
                  style={{height: 60}} 
                  onPress={()=>{this._onPressSnapCard()}} 
                  text={i18n.t("snap_card")} 
              />
              }
              
            </View>
              
        </View>
      </KeyboardAvoidingView>
             
    )
  }
}


export default  connect(state => ({
  now_snap_card: state.payment.now_snap_card,
  payment: state.payment,
  active_marker: state.station.active_marker
}),
(dispatch) => ({
  actions: {
    payment: bindActionCreators(ActionsPayment, dispatch),
    setting: bindActionCreators(ActionsSetting, dispatch),
    rent: bindActionCreators(ActionsRent, dispatch)
  }
})
)(CreateCardScreen);



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8"
  },  
  contentContainer: {
    paddingTop: ThemaStyle.paddingTopStatic,
    paddingLeft: "8%",
    paddingRight: "8%",
    flexGrow: 1,
    alignContent: "center",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20, 
    fontWeight: "bold",
    paddingBottom: 20
  },
  footer: {
    
    // flexDirection: "column",
    // justifyContent: "flex-end",
    // alignItems: "center",
  },
  description: {
    color: Colors.black,
    fontSize: 12,
    marginTop: 10,
    textAlign: "center",
  },
  textButton: {
    color: Colors.green,
    fontSize: 18
  },
  error_text: {
    color: "#EA9996",
    fontSize: 12
  },
})