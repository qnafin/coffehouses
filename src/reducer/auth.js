import * as types from '../actions/actionTypes';

const initialState = {
    verify: {success: false, errors: [], error: null},//верификация телефона
    code: {success: false, errors: [], error: null} //проверка смс кода
};


export default function auth(state = initialState, action = {}) {
  
    switch (action.type) {
        
        case types.AUTH_VERIFY_PHONE:
        return {
            ...state,
            verify: action.payload
        };
        case types.AUTH_SEND_SMS_CODE:
            
            return {
                ...state,
                code: action.payload
            };
        
        default:
        return state;
    }
}
