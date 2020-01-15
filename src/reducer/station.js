import * as types from '../actions/actionTypes';
import h from "../api/helper";

const initialState = {
    points: [], 
    stations: [], 
    detail: null, 
    active_marker: {
      latitude: null, 
      longitude: null, 
      idStation: null,
      timeout: 0
    }
};

const mergeStations = (stations, payload) => {
    
    let ids = payload.map((item) => item.id)
    if(stations.length) {
        let filterin_stations = stations.filter((item) => {
            return !h.inArray(item.id, ids) 
        })
        return filterin_stations.concat(payload)
    }
    return payload;
}

export default function station(state = initialState, action = {}) {
  
  switch (action.type) {
    
    case types.STATION_POINTS_FETCH:
      return {
          ...state,
          points: mergeStations(state.points, action.payload)
      };

    case types.STATIONS_FETCH:
      return {
          ...state,
          points: mergeStations(state.points, action.payload),
          stations: mergeStations(state.stations, action.payload)
      };
    case types.STATION_ACTIVE_MARKER: {
      return {
        ...state,
        active_marker: action.payload
      }
    }
    case types.STATION_DEACTIVE_MARKER: {
      return {
        ...state,
        active_marker: initialState.active_marker
      }
    }
    case types.STATION_DETAIL_FETCH:
      return {
          ...state,
          detail: action.payload
      };
    case types.STATION_DETAIL_CLEAR:
      return {
          ...state,
          detail: null
      };
    default:
      return state;
  }
}
