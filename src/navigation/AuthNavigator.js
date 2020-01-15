import { createStackNavigator } from 'react-navigation-stack';


import AuthPhoneScreen from '../modules/auth/screens/AuthPhoneScreen'
import AuthCodeScreen from '../modules/auth/screens/AuthCodeScreen'


const AuthStack = createStackNavigator(
  {
    AuthPhone: AuthPhoneScreen,
    AuthCode: AuthCodeScreen,
  }
);


export default AuthStack;

