import React from 'react';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';

import * as ActionsUser from '../actions/User';
import * as ActionsSetting from '../actions/Setting';

import MainNavigator from './MainNavigator';
import AuthNavigator from './AuthNavigator';

import Loading from '../components/Loading'


class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    //this._bootstrapAsync();
  }
  componentDidMount() {
    let {actions} = this.props
    // Fetch the token from storage then navigate to our appropriate place
    actions.user.getUser()
    actions.setting.getLocale()
  }
  // componentWillUnmount() {
  //   //clearInterval(this.interval);
  // }
  componentDidUpdate(prevProps) {
    const { user, actions , navigation} = this.props;
    if(prevProps.user !== user) {
       // This will switch to the App screen or Auth screen and this loading
       // screen will be unmounted and thrown away.
      navigation.navigate(user.id ? 'Main' : 'Auth');
     
    }
  } 
  
  // Render any loading content that you like here
  render() {

    return (
      <Loading/>
    );
  }
}

const AuthLoading=  connect(state => ({
  user: state.user
}),
(dispatch) => ({
  actions: {
    user: bindActionCreators(ActionsUser, dispatch),
    setting: bindActionCreators(ActionsSetting, dispatch),
  }
})
)(AuthLoadingScreen);

export default createAppContainer(
  createSwitchNavigator({
    AuthLoading: AuthLoading,
    Auth: AuthNavigator,
    Main: MainNavigator,
  })
);
