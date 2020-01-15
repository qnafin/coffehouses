import * as types from '../actions/actionTypes';

const initialState = {
  status: null,
  isRent: false,
  loader: false
};

export default function rent(state = initialState, action = {}) {
  
  switch (action.type) {
    
    case types.RENT_FETCH:
      return {
          ...state,
          status: action.payload,
          isRent: true
     };
    case types.RENT_FALSESTART:
      return {
          ...state,
          loader: true
      };
    case types.RENT_STOP:
      return {
          ...state,
          status: null,
          isRent: false
    };
    default:
      return state;
  }
}
