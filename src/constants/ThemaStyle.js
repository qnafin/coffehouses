import {
  Platform
} from 'react-native';
import L from '../constants/Layout'


export default {
  shadow: Platform.OS == "ios" ?  {
    shadowOffset:{  width: 1,  height: 1,  },
    shadowColor: '#ccc',
    shadowOpacity: 0.5,
    elevation: 3
  } : {
    borderWidth: 1,
    borderColor: "#ececec"
  },
  paddingTopStatic: Platform.OS == "ios" ? "15%" : "15%",
  fontSize10: L.isSmallDevice ? 8 : 10,
  fontSize11: L.isSmallDevice ? 9 : 11,
  fontSize12: L.isSmallDevice ? 10 : 12,
  fontSize14: L.isSmallDevice ? 12 : 14,
  fontSize16: L.isSmallDevice ? 14 : 16,
  fontSize17: L.isSmallDevice ? 15 : 17,
  fontSize18: L.isSmallDevice ? 16 : 18,
  fontSize22: L.isSmallDevice ? 20 : 22,
  fontSize34: L.isSmallDevice ? 28 : 34,
};
