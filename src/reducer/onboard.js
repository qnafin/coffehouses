import * as types from '../actions/actionTypes';

const initialState = {slider: []};


export default function onboard(state = initialState, action = {}) {
  
  switch (action.type) {
    
    case types.ONBOARD_FETCH:
      return {
          ...state,
          slider: action.payload
      };
    default:
      return state;
  }
}
