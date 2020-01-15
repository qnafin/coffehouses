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
import IconClose from '../../../components/icon/IconClose'
import Logo from '../../../components/Logo';

import Layout from '../../../constants/Layout'
import config from '../../../../app.json'
import helper from '../../../api/helper'

class AuthPhoneScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: "",
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
  _onClearPhone() {
    this.setState({phone: ""})
  }
  render () {
    const {phone, isChecking} = this.state
    const {auth, navigation} = this.props
    const isDisabled = phone.length < 16

    return (
      <View style={[styles.container, {paddingHorizontal: 0}]}>
          <KeyboardAvoidingView style={[styles.container]} behavior={Platform.OS === "ios" ? "padding" : false} enabled>
          
            <View style={styles.contentContainer}>
                <View />
                <View style={styles.header}>
                  <Logo/>
                </View>
                <View>
                    <Text style={styles.title}> {i18n.t("your_phone")}</Text>
                    <Text style={styles.description}>{i18n.t("enter_phone_number_description")} </Text>
                    <View style={ styles.contentBlock }>
                      <View style={styles.inputBlock}>
                        <TextInputMask
                            style={[ styles.inputText]}
                            type={'cel-phone'}
                            options={{
                              maskType: 'BRL',
                              withDDD: true,
                              dddMask: '+9 999 999-99-99'
                            }}
                            maxLength={16}
                            selectionColor={Colors.salate}
                            placeholder={i18n.t("enter_phone_number")}
                            autoFocus={true}
                            underlineColorAndroid="transparent"
                            keyboardType="number-pad"
                            value={phone}
                            onChangeText={text => this._onChangeText(text)}
                        />
                        {phone.length > 1 &&
                          <IconClose 
                            onPress={()=>this._onClearPhone()}
                            style={styles.close}
                          />
                        }
                        
                      </View>
                      
                        <Text style={styles.description}>
                          {auth.verify.errors &&
                              auth.verify.errors.map((err, index) => <Text style={styles.error_text} key={index}>{err.message}</Text>)}
                        </Text>
                    </View>
                </View>
                <View style={styles.footer}>
                    <ButtonThema
                      loading={isChecking}
                      disabled={isDisabled}
                      text={i18n.t("sing_in")}
                      onPress={()=>this._onNextButton()}
                    />
                    <Text style={[styles.agreement_text]}>
                      {i18n.t("user_agreement_text")}
                      {" "}
                      <Link url={config.link_user_agreement} text={i18n.t("user_agreement")}/>
                    </Text> 
                </View>
            </View>
        </KeyboardAvoidingView>
         
    </View>
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
