import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Image,
  NativeModules,
  TouchableOpacity
} from 'react-native';
import {PaymentRequest} from "react-native-payments"


const METHOD_DATA = [{
    supportedMethods: ['apple-pay'],
    data: {
      merchantIdentifier: 'merchant.world.powerapp',
      supportedNetworks: ['visa', 'mastercard'],
      countryCode: 'RU',
      currencyCode: 'RUB'
    }
  }];
const DETAILS = {
  id: 'basic-example',
  displayItems: [
    {
      label: 'Movie Ticket',
      amount: { currency: 'RUB', value: '1.00' }
    }
  ],
  total: {
    label: 'Merchant Name',
    amount: { currency: 'RUB', value: '1.00' }
  }
};


class ApplePayButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
    };
  }

  componentDidMount() {
    
  }
  _onPay() {
    const paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS);
    paymentRequest.show()
      .then(paymentResponse => {
        const { transactionIdentifier, paymentData } = paymentResponse.details;

        return fetch("https://velo-port.ru/test.php", {
          method: 'POST',
          body: {
            transactionIdentifier,
            paymentData
          }
        })
        .then(res => res.json())
        .then(successHandler)
        .catch(errorHandler)
      });
  }
  render() {
    let {style} = this.props
    if(Platform.OS == "ios") {
      return (
        <TouchableOpacity
          style={[style]}
          onPress={() => this._onPay()}>
            <Image 
              source={require("../../../assets/images/icon/APay.png")} 
              resizeMode={"contain"} 
              style={{height: 22}}
            />
        </TouchableOpacity>
      )
    } 
    return null
  }
}

export default ApplePayButton;