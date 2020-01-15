
import _ from "lodash";
import * as types from './actionTypes';
import * as api from '../api'
import i18n from '../i18n';
import {setError} from './index'

const Search = {
    
    getAddress({address, lat, lon}) {
        return (dispatch, getState, {}) => {
            if( _.isNull(lat) && _.isNull(lon)) {
                let state = getState();
               
                lat = state.user.geolocation.latitude;
                lon = state.user.geolocation.longitude;
            }
            return api.getAddress({address, lat, lon}).then((data)=>{
                console.log({address, lat, lon}, data)
                if(data.success) {
                    dispatch({
                        type: types.SEARCH_ADDRESS_FETCH, 
                        payload: data.payload.points
                    })
                } else {
                    setError(dispatch, data.error)
                }
            })
        }
    },
    clear() {
        return (dispatch, getState, {}) => {
            dispatch({
                type: types.SEARCH_ADDRESS_CLEAR
            })
        }
    },
    goToAddress({latitude, longitude}) {
        return (dispatch, getState, {}) => {
           
            dispatch({
                type: types.SEARCH_ADD_PIN, 
                payload: {latitude, longitude}
            })
                
        }
    },
 }

module.exports = Search;