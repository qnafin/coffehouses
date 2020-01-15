
import * as types from './actionTypes';
import * as api from '../api'
import Token from '../api/token'
import helper from '../api/helper'

import {setError} from './index';

const User = {
    authVerifyPhone(phone) {
        return (dispatch, getState, {}) => {
            return api.authVerifyPhone(phone).then((data) => {
                console.log('authVerifyPhone', data);
                dispatch({
                    type: types.AUTH_VERIFY_PHONE,
                    payload: data
                })
            })
        }
    },
    authSMSCode({phone, code}) {
        return (dispatch, getState, {}) => {

            return api.authSMSCode({phone, code}).then((data) => {

                console.log('authSMSCode', data);


                if(data.success) {
                    let token = data.payload
                    Token.setToken(token).then(() => {
                        dispatch({
                            type: types.AUTH_SEND_SMS_CODE,
                            payload: data
                        })
                    })
                } else {
                    dispatch({
                        type: types.AUTH_SEND_SMS_CODE,
                        payload: data
                    })
                }
            })
        }
    },
    logOut() {
        return (dispatch, getState, {}) => {
            this.deleteUser()
        }
    },
    getUser() {
        return (dispatch, getState, {}) => {
            return api.getUser().then((data) => {
                let user = data.payload;
                console.log('getUser', user);
                if(user) {
                    dispatch({
                        type: types.USER_FETCH,
                        payload: user
                    })
                } else {
                    this.deleteUser()
                }
            })
        }
    },
    setUser(user) {
        return (dispatch, getState, {}) => {

            api.createOrUpdateUser({
                name: user.name,
                gender: user.gender
            }).then((res) => {
                let user = res.user;
                Token.setToken(user.token).then((res) => {
                    console.log('setUser', user)
                    dispatch({
                        type: types.USER_CREATE,
                        payload: user
                    })
                })
            }).catch((err) => console.log(error))


        }
    },
    setUserFields(fields) {
        return (dispatch, getState, {}) => {
            dispatch({
                type: types.USER_UPDATE,
                payload: fields
            })
        }
    },
    deleteUser() {
        return (dispatch, getState, {}) => {
            Token.delToken()
            dispatch({
                type: types.USER_DROP
            })
        }
    },

    setGeolocation(geolocation) {
        return (dispatch, getState, {}) => {
            dispatch({
                type: types.USER_GEOLOCATION_SET,
                payload: geolocation
            })
        }
    },
    getCurrentPosition () {
        return (dispatch, getState, {}) => {
           
            let state = getState();
            if(state.user.permission_geolocation) {
                return new Promise((resolve, reject) => {
                    api.setGeolocationToMemory(state.user.geolocation)
                    resolve({coords: state.user.geolocation})
                 })
            }

            return api.getCurrentPosition()
                .then(position => {
                    api.setGeolocationToMemory(position.coords)
                    return position
                })
                .catch((err) => {
                    setError(dispatch, `Geolocation ${err.code} - ${err.message}`)
                })

        }
    },
    getGeolocationOfMemory() {
        return (dispatch, getState, {}) => {
            return api.getGeolocationOfMemory()
                .then(geolocation => {
                    // dispatch({
                    //     type: types.USER_GEOLOCATION_DEFAULT_SET,
                    //     payload: geolocation
                    // })
                    return geolocation
                })

        }
    }
}

module.exports = User;
