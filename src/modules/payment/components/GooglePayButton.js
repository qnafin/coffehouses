import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  TouchableOpacity
} from 'react-native';
import CONFIG from "../../../../app.json"
import { GooglePay } from 'react-native-google-pay';

const allowedCardNetworks = ['VISA', 'MASTERCARD'];
const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];

const requestData = {
  cardPaymentMethod: {
    tokenizationSpecification: {
      type: 'PAYMENT_GATEWAY',
      // other:
      gateway: CONFIG.gateway,
      gatewayMerchantId: CONFIG.gatewayMerchantId,
    },
    allowedCardNetworks,
    allowedCardAuthMethods,
  },
  transaction: {
    totalPrice: '1',
    totalPriceStatus: 'FINAL',
    currencyCode: 'RUB',
  },
  merchantName: 'Example Merchant',
};

// Set the environment before the payment request


class GooglePayButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      available: false
    };
  }

  componentDidMount() {
    GooglePay.setEnvironment(GooglePay.ENVIRONMENT_TEST);
    
    // Check if Google Pay is available
    GooglePay.isReadyToPay(allowedCardNetworks, allowedCardAuthMethods)
    .then((ready) => { 
      this.setState({available: true})
    })
  }
  _onPay() {
    
    // Check if Google Pay is available
    GooglePay.isReadyToPay(allowedCardNetworks, allowedCardAuthMethods)
    .then((ready) => {
      if (ready) {
        // Request payment token
        GooglePay.requestPayment(requestData)
          .then((token) => {
            // Send a token to your payment gateway
            console.log(token)
          })
          .catch((error) => console.log(error.code, error.message));
      }
    })
  }
  render() {
    let {style} = this.props
    let {available} = this.state

    if(Platform.OS == "android" && available) {
      return (
        <TouchableOpacity
          style={[style]}
          onPress={() => this._onPay()}>
            <Image 
              source={require("../../../assets/images/icon/GPay.png")} 
              resizeMode={"contain"} 
              style={{height: 22}}
            />
        </TouchableOpacity>
      )
    } 
    return null
  }
}

export default GooglePayButton;