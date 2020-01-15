
import * as types from './actionTypes';
import * as api from '../api'
import i18n from '../i18n';

import * as RNLocalize from "react-native-localize";
console.log('getLocales', RNLocalize.getLocales());
const Setting = {
    
    getLocale() {
        return (dispatch, getState, {}) => {
            try {
               return api.getLocale().then((locale)=>{
                    console.log('getLocale', locale)
                    if(locale) {
                        dispatch({
                            type: types.SETTING_LOCALE_FETCH, 
                            payload: locale
                        })
                    } else {
                        this.setLocale('ru') //RNLocalize.getLocales()
                    }
                    return locale;
                })
                
            } catch(err) {
                console.log(err)
            }
        }
    },
    setLocale(locale) {
        return (dispatch, getState, {}) => {
            try {
                locale = locale.split('-')[0]
                api.setLocale(locale).then((res)=>{
                    console.log('setLocale', res)
                    i18n.locale = res
                    dispatch({
                        type: types.SETTING_LOCALE_SET, 
                        payload: res
                    })
                })
                
            } catch(err) {
                console.log(err)
            }
        }
    },
    setStyleOverlay(bool) {
        return (dispatch, getState, {}) => {
            dispatch({
                type: types.SETTING_STYLE_OVERLAY, 
                payload: bool
            })
        }   
    },
    setStyleHiddenHeader(bool) {
        return (dispatch, getState, {}) => {
            dispatch({
                type: types.SETTING_STYLE_HIDDEN_HEADER, 
                payload: bool
            })
        }
    },
    setStyleHiddenSearch(bool) {
        return (dispatch, getState, {}) => {
            dispatch({
                type: types.SETTING_STYLE_HIDDEN_SEARCH, 
                payload: bool
            })
        }
    }
 }

module.exports = Setting;