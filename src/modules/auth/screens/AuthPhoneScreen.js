import React from 'react';
import {
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
  Platform,
} from 'react-native';

import { TextInputMask } from 'react-native-masked-text'

import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ActionsUser from '../../../actions/User';
import i18n from '../../../i18n';
import ButtonThema from "../../../components/ButtonThema"
import Link from "../../../components/Link"
import styles from '../style'


import Colors from '../../../constants/Colors';
import HeaderBack from '../../../components/HeaderBack'

import Layout from '../../../constants/Layout'
import config from '../../../../app.json'
import helper from '../../../api/helper'

class AuthPhoneScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: "+7 ",
      isChecking: false,
    };
    this.phone_format = ''
  }

  static navigationOptions = {
    header: null,
  };

  componentDidUpdate(prevProps) {
    let {navigation, actions, auth} = this.props

    if (prevProps.auth.verify !== auth.verify) {
      this.setState({ isChecking: false });
      if (auth.verify.success) {
         actions.user.setUserFields({ phone : this.phone_format })
         navigation.navigate('AuthCode')
      }
    }
  }
  _onNextButton() {
    let { phone } = this.state
    let { actions} = this.props
    this.phone_format = helper.phoneNumber(phone);
    this.setState({ isChecking: true });

    actions.user.authVerifyPhone(this.phone_format)

  }
  _onChangeText(text) {
    this.setState({phone: text})
  }

  render () {
    const {phone, isChecking} = this.state
    const {auth, navigation} = this.props
    const isDisabled = phone === ""

    return (
      <KeyboardAvoidingView style={[styles.container]} behavior={Platform.OS === "ios" ? "padding" : false} enabled>
       
        <View style={styles.contentContainer}>
            <HeaderBack />
            <Text style={styles.title}> {i18n.t("login_or_register")}</Text>
            <View style={ styles.contentBlock }>
              <TextInputMask
                  style={[ styles.inputText]}
                  type={'cel-phone'}
                  options={{
                    maskType: 'BRL',
                    withDDD: true,
                    dddMask: '+9 (999) 999 99 99'
                  }}
                  maxLength={18}
                  selectionColor={Colors.salate}
                  autoFocus={true}
                  underlineColorAndroid="transparent"
                  keyboardType="number-pad"
                  value={phone}
                  onChangeText={text => this._onChangeText(text)}
              />
                <Text style={styles.description}>{i18n.t("enter_phone_number")} </Text>
                <Text style={styles.description}>
                  {auth.verify.errors &&
                      auth.verify.errors.map((err, index) => <Text style={styles.error_text} key={index}>{err.message}</Text>)}
                </Text>
            </View>
            <View style={styles.footer}>
                <Text style={{width: Layout.window.width - 150, fontSize: 10}}>
                  {i18n.t("user_agreement_text")}
                  {" "}
                  <Link url={config.link_user_agreement} text={i18n.t("user_agreement")}/>
                  {" "}{i18n.t("and")}{"\n"}
                  <Link url={config.link_privacy_policy} text={i18n.t("privacy_policy")}/>
                </Text>
                <View style={{width: 100}}>
                  <ButtonThema
                    loading={isChecking}
                    disabled={isDisabled}
                    text={i18n.t("next")}
                    onPress={()=>this._onNextButton()}
                  />
                </View>
            </View>
        </View>
    </KeyboardAvoidingView>
    )
  }
}


export default connect(state => ({
  auth: state.auth,
  user: state.user,
}),
(dispatch) => ({
  actions: {
    user: bindActionCreators(ActionsUser, dispatch),
  }
})
)(AuthPhoneScreen);
