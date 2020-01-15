import * as types from '../actions/actionTypes';

const initialState = {
  tariffs: [], 
  faq: [], 
  partner: {text: null}, 
  company: {text: null}, 
  contact: {text: null, phone: null, email: null},
  apay: {text: null},
  gpay: {text: null}
};


export default function main(state = initialState, action = {}) {
  
  switch (action.type) {
    
    case types.MAIN_FETCH:
      return {
          ...state,
          ...action.payload
      };
    default:
      return state;
  }
}
