
import _ from "lodash";
import * as types from './actionTypes';
import * as api from '../api'
import i18n from '../i18n';
import {setError} from './index'

const Rent = {
    getRent() {
        return (dispatch, getState, {}) => {
            api.getRent().then((data) => {
                if(data.success) {
                    console.log('rent', data.payload)
                    dispatch({
                        type: types.RENT_FETCH,
                        payload: data.payload
                    })
                } else {
                    this.rentStop()
                    //setError(dispatch, data.error)
                }
            });
        }
    },
    createRent(station_id, payment_type) {
        return (dispatch, getState, {}) => {
            api.createRent(station_id, payment_type).then((data) => {
                if(data.success) {
                    
                    dispatch({
                        //Открываем модалку Начала аренды, 
                        //данные должны прийти сокетом
                        type: types.RENT_FALSESTART 
                    })
                    this.getRent()
                } else {
                    setError(dispatch, data.error)
                }
            });
        }
    },
    rentStop() {
        return (dispatch, getState, {}) => {
            dispatch({
                type: types.RENT_STOP
            })
        }
    },
 }

module.exports = Rent;