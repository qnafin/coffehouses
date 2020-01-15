import * as types from '../actions/actionTypes';

const initialState = {
  cards: [],
  now_snap_card: null,
  error: null,
  description: null, 
  success: false, //карта привязана
  secure_3ds_url: null,
  checks:[]
};

export default function payment(state = initialState, action = {}) {
  
  switch (action.type) {
    
    case types.PAYMENTS_CARDS_FETCH:
      return {
          ...state,
          ...action.payload
     };
    case types.PAYMENTS_CARD_CREATE:
      return {
          ...state,
          cards: [{
            ...action.payload
          }],
          error: null,
          now_snap_card: action.payload
     };
    case types.PAYMENTS_CARD_CREATE_SUCCESS: 
      return {
        ...state,
        error: null,
        success: true
      };
    case types.PAYMENTS_CARD_CREATE_ERROR:
      return {
        ...state, 
        success: false,
        error: action.payload
      };
      
    case types.PAYMENTS_CARD_DROP:
      return {
        ...state,
        cards: [],
        success: false,
        now_snap_card: null
      }
    
    case types.PAYMENTS_CARD_CREATE_3DS:
      return {
        ...state,
        secure_3ds_url: action.payload.redirectToUrl
      };
    case types.PAYMENTS_CARD_DROP_3DS:
      return {
        ...state,
        success: false,
        secure_3ds_url: null
      };
      
    case types.PAYMENTS_CHECKS_FETCH:
      return {
        ...state, 
        checks: action.payload
      };
    default:
      return state;
  }
}
