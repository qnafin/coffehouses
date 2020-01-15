import * as types from '../actions/actionTypes';

const initialState = {
  socket: null,
  rent_start: null,
  rent_end: null
};


export default function socket(state = initialState, action = {}) {
  
  switch (action.type) {
    
    case types.SOCKET_RENT_START:
      return {
          ...state,
          rent_start: action.payload, 
          rent_end: null
      };
    case types.SOCKET_RENT_END:
      console.log(action.payload)
      return {
          ...state,
          rent_end: action.payload,
          rent_start: null
      };
    default:
      return state;
  }
}
