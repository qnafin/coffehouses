import * as types from '../actions/actionTypes';

const initialState = {
  locale: "ru", 
  style: {
    overlay: false,
    hidden_header: false,
    hidden_search: false
  }
};


export default function setting(state = initialState, action = {}) {
  
  switch (action.type) {
    
    case types.SETTING_LOCALE_FETCH:
      return {
          ...state,
          locale: action.payload
      };
    case types.SETTING_LOCALE_SET:
      return {
          ...state,
          locale: action.payload
      }; 
    case types.SETTING_STYLE_OVERLAY:
      return {
          ...state,
          style: {
            ...state.style,
            overlay: action.payload
          }
      };  
    case types.SETTING_STYLE_HIDDEN_HEADER:
      return {
          ...state,
          style: {
            ...state.style,
            hidden_header: action.payload
          }
      }; 
    case types.SETTING_STYLE_HIDDEN_SEARCH:
      return {
          ...state,
          style: {
            ...state.style,
            hidden_search: action.payload
          }
      };    
    default:
      return state;
  }
}
