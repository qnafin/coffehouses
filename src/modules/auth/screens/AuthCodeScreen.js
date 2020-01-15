import React from 'react';
import {
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
  Platform
} from 'react-native';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ActionsUser from '../../../actions/User';
import i18n from '../../../i18n';
import ButtonThema from "../../../components/ButtonThema"
import styles from '../style'
import IconClose from '../../../components/icon/IconClose'
import Logo from '../../../components/Logo';
import Layout from '../../../constants/Layout'

import helper from '../../../api/helper'
import Colors from '../../../constants/Colors';

const TIMER = 59

class AuthCodeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      resendCode: false,
      timer: 0,
      isChecking: false,
    };
  }

  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this._startTimer()
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate(prevProps, prevState) {
    let {navigation, actions, auth, code} = this.props
    let {timer} = this.state
    if (prevProps.auth.code !== auth.code) {
      this.setState({ isChecking: false });
      if (auth.code.success === false) {

        this._startTimer()

      }

      if (auth.code.success) {
        actions.user.setUserFields({code: this.state.code, token: true})
        navigation.navigate('Main')
      }

    }
    if (prevState.timer !== timer) {
      if (timer <= 1) {
        this.setState({timer: 0, resendCode: true})
        clearInterval(this.interval);

      }
    }
  }

  _startTimer() {
    let {timer} = this.state
    this.setState({resendCode: false})
    if (timer == 0) {
      this.setState({timer: TIMER})
      clearInterval(this.interval);
      this.interval = setInterval(
        () => {
          this.setState({timer: this.state.timer - 1, resendCode: false})
          console.log('_startTimer')
        },
        1000
      );
    }

  }

  _onSendCode(code) {
    let {actions, user} = this.props
    console.log(code);
    this.setState({ isChecking: true });
    actions.user.authSMSCode({phone: user.phone, code})
  }

  _onChangeText(text) {
    this.setState({code: text})
    if (text.length == 4) {
      this._onSendCode(text)
    }
  }

  _authVerifyPhone() {
    let {actions, user} = this.props
    actions.user.authVerifyPhone(user.phone);
    this.setState({resendCode: false})
    this._startTimer()
  }

  render() {
    let {code, timer, resendCode, isChecking} = this.state
    let {auth, user, navigation} = this.props
    let isDisabled = (code.length < 4) 
    let showBottonSendNewSmsCode = (resendCode)
    console.log(timer, user)
    return (
      <KeyboardAvoidingView style={[styles.container]} behavior={Platform.OS == "ios" ? "padding" : false} enabled>
       
        <View style={[styles.contentContainer, {paddingTop: 40}]}>
          <View />
          <View style={styles.header}>
            <Logo/>
          </View>
          <View>
            <Text style={styles.title}> {i18n.t("verification_code")}</Text>
              <Text style={styles.description}>{i18n.t("enter_code_number")} {user.phone}</Text>
              <View style={[styles.contentBlock]}>
                <View style={styles.inputBlock}>
                  <TextInput
                    style={[styles.inputText, {paddingLeft: 0}]}
                    selectionColor={Colors.salate}
                    autoFocus={true}
                    underlineColorAndroid="transparent"
                    keyboardType="number-pad"
                    value={code}
                    maxLength={4}
                    onChangeText={text => this._onChangeText(text)}
                  />
                  <IconClose 
                            onPress={()=>this._onClearPhone()}
                            style={styles.close}
                          />
                </View>
              
              
              <Text style={styles.description}>
                {auth.code.error && timer > 0
                && <Text style={styles.error_text}>
                  Введен неверный код, отправить новый можно через {timer} секунд
                  {/*auth.code.error.message*/}
                </Text>}
              </Text>
            </View>
          </View>

          
          <View/>
          <View style={styles.footer}>
            <View style={{}}>
              {(timer > 0) && <Text style={{fontSize: 16}}> 00:{helper.secondFormat(timer)} </Text>}

            { (showBottonSendNewSmsCode) &&
              <TouchableOpacity onPress={()=>this._authVerifyPhone()}>
                    <Text style={{fontSize: 16}}> {i18n.t('send_new_code')} </Text>
               </TouchableOpacity>
            }
          </View>
          <ButtonThema
              loading={isChecking}
              disabled={ isDisabled }
              text={i18n.t("sing_in")}
              onPress={()=>this._onSendCode(code)}
            />
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
)(AuthCodeScreen);
