import * as types from './actionTypes';
import * as api from '../api'

import * as socket from '../api/socket';

export const  connectSocket = ({room}) => {
    return (dispatch, getState, {}) => {
        let client = socket.createClient({clientId:`${room}-${Date.now()}`, room});
        client.on('messageReceived', (message) => {
            switch(message.payloadString.event)
            {
                case "rent_start":
                    dispatch({
                        type: types.SOCKET_RENT_START, 
                        payload: message.payloadString.payload
                    })
                    break;
            
                default:
                    break;
            }
            
        });
        
    }
}
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
