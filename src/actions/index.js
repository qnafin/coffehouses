import * as types from './actionTypes';
import * as api from '../api'


export const setError = (dispatch, error) => {
    dispatch({
        type: types.ERROR_FETCH, 
        payload: error
    })
}
export const dropError = (error) => {
    return (dispatch, getState, {}) => {
        dispatch({
            type: types.ERROR_DROP, 
        })
    }
}
export const getOnboard = () => {
    return (dispatch, getState, {}) => {
        
        return api.getOnboard().then((data)=>{
            if(data.success) {
                dispatch({
                    type: types.ONBOARD_FETCH, 
                    payload: data.payload.slider
                })
            } else {
                setError(dispatch, data.error)
            }
        })
    }
}
export const getMain = () => {
    return (dispatch, getState, {}) => {
        
        return api.getMain().then((data)=>{
            
            if(data.success) {
                dispatch({
                    type: types.MAIN_FETCH, 
                    payload: data.payload
                })
            } else {
                setError(dispatch, data.error)
            }
        })
    }
}

export const setConnectInfo = (data) => {
    return (dispatch, getState, {}) => {
        dispatch({
            type: types.CONNECTINFO, 
            payload: data
        })
    }
}
