//import { Updates } from 'expo';

import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import i18n from '../../../i18n';
import { connectActionSheet } from '@expo/react-native-action-sheet'


import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ActionsSetting from '../../../actions/Setting';

class LanguageButtom extends React.Component {
    _onOpenActionSheet = () => {
        // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
        let {setting, actions} = this.props
        let options = [
            "en",
            "ru",
            "cancel"
        ];
        let selected_lang = Number(Object.keys(options).find((item) => setting.locale == options[item]));
        let destructiveButtonIndex = selected_lang;
        let cancelButtonIndex = options.length - 1;

        this.props.showActionSheetWithOptions(
          {
            options: options.map((item) => i18n.t(item)),
            cancelButtonIndex,
            destructiveButtonIndex,
          },
          (buttonIndex) => {
              let selected_item = options[ buttonIndex ];
              if(buttonIndex != selected_lang && buttonIndex != cancelButtonIndex) {
                //меняем язык
                actions.setting.setLocale(selected_item)
                //перезагружаем
                //Updates.reload()
              }
          }
        );
    };

    render() {
        return (
            <TouchableOpacity onPress={()=> this._onOpenActionSheet()} {...this.props} >
                {this.props.children}
            </TouchableOpacity>
        );
    } 
}

export default  connect(state => ({
    setting: state.setting
  }),
  (dispatch) => ({
    actions: {
        setting: bindActionCreators(ActionsSetting, dispatch),
    }
  })
  )(connectActionSheet(LanguageButtom));

const styles = StyleSheet.create({
   
});
