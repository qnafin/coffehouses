
import * as types from './actionTypes';
import * as api from '../api'
import i18n from '../i18n';
import _ from "lodash"
import {setError} from './index';

const Station = {
    
    getPoints({latitude, longitude, latitudeDelta, longitudeDelta}) {
        return (dispatch, getState, {}) => {
            return api.getStationPoints({latitude, longitude, latitudeDelta, longitudeDelta}).then((data)=>{
                //console.log('getStationPoints', {latitude, longitude, latitudeDelta, longitudeDelta}, data)
                if(data.success) {
                    dispatch({
                        type: types.STATION_POINTS_FETCH, 
                        payload: data.payload.points
                    })
                } else {
                    setError(dispatch, data.error)
                }

            })
        }
    },
    getStationListPage({latitude, longitude}, page=1) {
        
        return (dispatch, getState, {}) => {
            if( _.isNull(latitude) && _.isNull(longitude)) {
                let state = getState();
               
                latitude = state.user.geolocation.latitude;
                longitude = state.user.geolocation.longitude;
            }
            return api.getStationListPage({latitude, longitude}, page).then((data)=>{
                //console.log('data', data)
                if(data.success) {
                    dispatch({
                        type: types.STATIONS_FETCH, 
                        payload: data.payload
                    })
                } else {
                    setError(dispatch, data.error)
                }

            })
        }
    },
    getStationDetail(id) {
        return (dispatch, getState, {}) => {
            
            dispatch({
                type: types.STATION_DETAIL_CLEAR
            })
            
            return api.getStationDetail(id).then((data)=>{
                
                if(data.success) {
                    dispatch({
                        type: types.STATION_DETAIL_FETCH, 
                        payload: data.payload
                    })
                } else {
                    setError(dispatch, data.error)
                }

            })
        }
    },
    goToStation({latitude, longitude, idStation}) {
        return (dispatch, getState, {}) => {
           
            dispatch({
                type: types.STATION_ACTIVE_MARKER, 
                payload: {latitude, longitude, idStation}
            })
                
        }
    }, 
    deactiveStation() {
        return (dispatch, getState, {}) => {
            dispatch({
                type: types.STATION_DEACTIVE_MARKER
            }) 
        }
    },
    
    clearActiveMarker() {
        return (dispatch, getState, {}) => {
            dispatch({
                type: types.STATION_ACTIVE_MARKER_CLEAR
            })
                
        }
    }
 }

module.exports = Station;