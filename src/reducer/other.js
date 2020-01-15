import * as types from '../actions/actionTypes';

const initialState = {errors: [], error: null, connect_info: null};


export default function other(state = initialState, action = {}) {
  
  switch (action.type) {
    
    case types.ERROR_FETCH:
      state.errors.push(action.payload)
      
      return {
          ...state,
          error: action.payload
      };
    case types.ERROR_DROP:
      return {
          ...state,
          error: null
      };
      
    case types.CONNECTINFO:
      return {
          ...state,
          connect_info: action.payload
      }; 
    default:
      return state;
  }
}
