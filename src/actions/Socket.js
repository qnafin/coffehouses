
import _ from "lodash";
import * as types from './actionTypes';
import * as api from '../api'
import i18n from '../i18n';
import {setError} from './index'

import * as socket from '../api/socket';

const ConnectSocket = {
    connectSocket({room}) {
        return (dispatch, getState, {}) => {
            let client = socket.createClient({clientId:`${room}-${Date.now()}`, room});
            client.on('messageReceived', (message) => {
                let data = JSON.parse(message.payloadString)

                switch(data.event)
                {
                    case "rent_start":
                        //начало аренды
                        dispatch({
                            type: types.SOCKET_RENT_START, 
                            payload: data.payload
                        })
                        break;
                    case "rent_end":
                        //конец аренды
                        dispatch({
                            type: types.SOCKET_RENT_END, 
                            payload: data.payload
                        })
                        break;
                    case "card_done":
                        //привязана карта
                        dispatch({
                            type: types.PAYMENTS_CARD_CREATE_SUCCESS, 
                            payload: data.payload
                        })
                        break;
                    default:
                        break;
                }
                
            });
            
        }
    }
 }

module.exports = ConnectSocket;