
import React, { useState } from 'react';
import { YellowBox } from 'react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { Provider } from 'react-redux';
import store from './src/store';
import App from './src/App'

//YellowBox.ignoreWarnings(['RCTRootView cancelTouches']);


export default class AppContainer extends React.Component {
  render () {
    return (
      <ActionSheetProvider>
         <Provider store={store}>
          <App />
        </Provider>
      </ActionSheetProvider>
    );
  }
}


