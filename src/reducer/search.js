import * as types from '../actions/actionTypes';

const initialState = {
  addresses: [], 
  pins: [],
  bulavka: null
};


export default function search(state = initialState, action = {}) {
  
  switch (action.type) {
    
    case types.SEARCH_ADDRESS_FETCH:
      return {
          ...state,
          addresses: action.payload
      };
    case types.SEARCH_ADDRESS_CLEAR:
    
    return {
        ...state,
        addresses: []
    };
    case types.SEARCH_ADD_PIN:
      return {
          ...state,
          pins: [action.payload],
          bulavka: action.payload
      };
    default:
      return state;
  }
}
