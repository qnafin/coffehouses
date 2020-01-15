
import _ from "lodash";
import * as types from './actionTypes';
import * as api from '../api'
import i18n from '../i18n';
import {setError} from './index'
import h from "../api/helper"
import CONFIG from "../../app.json"

import CryptoJS from "crypto-js";
import moment from "moment"
const SHA256 = require("crypto-js/sha256");

const CryptoJSAesJson = {
  stringify: function (cipherParams) {
      var j = {ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)};
      if (cipherParams.iv) j.iv = cipherParams.iv.toString();
      if (cipherParams.salt) j.s = cipherParams.salt.toString();
      return JSON.stringify(j);
  },
  parse: function (jsonStr) {
      var j = JSON.parse(jsonStr);
      var cipherParams = CryptoJS.lib.CipherParams.create({ciphertext: CryptoJS.enc.Base64.parse(j.ct)});
      if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv)
      if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s)
      return cipherParams;
  }
}

const Payment = {
    getCards() {
        return (dispatch, getState, {}) => {
            api.getCards().then((data)=>{
                console.log('getCards', data)
                if(data.success) {
                    dispatch({
                        type: types.PAYMENTS_CARDS_FETCH,
                        payload: data.payload
                    })
                }
            });
        }
    },
    createCard({number, cvv, date, name}) {
        let originText = h.createCryptogram(number, date, cvv, CONFIG.gatewayMerchantId);
        let encryption_key = CONFIG.gatewayMerchantId;
        let ciphertext = CryptoJS.AES.encrypt(originText, encryption_key, {format: CryptoJSAesJson}).toString();

        console.log('crypota', JSON.stringify(ciphertext));
        console.log('name', name);
        //let bytes  = CryptoJS.AES.decrypt(ciphertext, encryption_key, {format: CryptoJSAesJson});
        //let originalText = bytes.toString(CryptoJS.enc.Utf8);
        //console.log('originalText', originalText);
        return (dispatch, getState, {}) => {
            api.createCard({
                crypto_key: ciphertext, 
                holder_name: name
            }).then((data)=>{
                console.log('createCard', data)
                if(data.success) {
                    if(data.payload.redirectToUrl) {
                        dispatch({
                            type: types.PAYMENTS_CARD_CREATE_3DS,
                            payload: data.payload
                        })
                    } else {
                        dispatch({
                            type: types.PAYMENTS_CARD_CREATE,
                            payload: {number, cvv, date, name}
                        })

                        //this.createCardSuccess()
                        
                    }
                } else {
                    dispatch({
                        type: types.PAYMENTS_CARD_CREATE_ERROR,
                        payload: data.error.message
                    })
                }
                
            })
        }
    },
    createCardSuccess() {
        return (dispatch, getState, {}) => {
            dispatch({
                type: types.PAYMENTS_CARD_CREATE_SUCCESS
            })
        }
    },
    dropCard() {
        return (dispatch, getState, {}) => {
            api.dropCard().then((data)=>{
                if(data.success) {
                    dispatch({
                        type: types.PAYMENTS_CARD_DROP
                    })
                }
            });
           
        }
    },
    dropLink3DS() {
        return (dispatch, getState, {}) => {
            console.log('PAYMENTS_CARD_DROP_3DS')
            dispatch({
                type: types.PAYMENTS_CARD_DROP_3DS
            })
        }
    },
    getChecks(rent_id) {
        return (dispatch, getState, {}) => {
            api.getChecks(rent_id).then((data)=>{
                if(data.success) {
                    dispatch({
                        type: types.PAYMENTS_CHECKS_FETCH,
                        payload: data.payload
                    })
                }
            });
           
        }
    }
 }

module.exports = Payment;