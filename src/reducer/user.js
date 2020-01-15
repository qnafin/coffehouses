import * as types from '../actions/actionTypes';

const initialState = {
  geolocation: {
    latitude: 55.738509, 
    longitude: 37.651099
  },
  permission_geolocation: false
};


export default function user(state = initialState, action = {}) {
  
  switch (action.type) {
    
    case types.USER_CREATE:
      return {
        ...state,
        ...action.payload,
        ...initialState
      };

    case types.USER_UPDATE:
      return {
        ...state,
        ...action.payload,
        ...initialState
      };

    case types.USER_FETCH:
      return {
        ...state,
        ...action.payload
      }
    case types.USER_DROP:
      return {};
    case types.USER_GEOLOCATION_SET:
      return {
        ...state,
        geolocation: action.payload,
        permission_geolocation: true
      }

    default:
      return state;
  }
}
