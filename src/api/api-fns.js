import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';

import config from '../../app.json'
const HOST = config.host

import helper from './helper'
import Token from './token';
let date = new Date();
const HEADER = {
  'Accept': 'application/json, text/plain, */*',
  'Content-Type': 'application/json',
  'Accept-Language': 'ru',
  'X-Timezone': date.getTimezoneOffset()/60
}

const api = {
  getLocale() {
    return AsyncStorage.getItem('@UserLocale:key')
            .then((response) => {
                if(response !== null) {
                    return response;
                } else {
                    return false
                }
            });
  },
  async setLocale(locale) {
    try {
        await AsyncStorage.setItem('@UserLocale:key', locale);
        console.log('SET LOCALE', locale);
        return locale;
    } catch (error) {
        console.log(error);
    }
  },
  getCurrentPosition() {
        if (Geolocation) {
          return new Promise(
            (resolve, reject) => Geolocation.getCurrentPosition(resolve, reject, {enableHighAccuracy: false, timeout: 20000, maximumAge: 0 })
          )
        } else {
          return new Promise(
            resolve => resolve({})
          )
        }
  },
  getGeolocationOfMemory() {
    return AsyncStorage.getItem('@UserGeolocation:key')
            .then((response) => {
                if(response !== null) {
                    return JSON.parse(response);
                } else {
                    return false
                }
            });
  },
  async setGeolocationToMemory(geolocation) {
    try {
        await AsyncStorage.setItem('@UserGeolocation:key', JSON.stringify(geolocation));
        
        return geolocation;
    } catch (error) {
        console.log(error);
    }
  },
  getOnboard() {
    return fetch(`${HOST}/onboarding`, {
        method: 'get',
        headers: HEADER,
      }).then(res=>res.json())
  },
  authVerifyPhone(phone) {
    console.log('api userVerify', phone)

    return fetch(`${HOST}/user/verify`, {
      method: 'post',
      headers: HEADER,
      body: JSON.stringify({phone : phone})
    }).then(res=> res.json())
  },
  authSMSCode({phone, code}) {
    console.log('api AuthCode', phone, code)
    return fetch(`${HOST}/user/auth`, {
      method: 'post',
      headers: HEADER,
      body: JSON.stringify({phone : phone, code})
    }).then(res=> res.json())
  },
  getUser() {
    return Token.getToken().then((token_hash)=> {
      HEADER['Authorization'] = token_hash;
      return fetch(`${HOST}/user`, {
          method: 'get',
          headers: HEADER,
        }).then(res=>res.json())
    })
  },
  createOrUpdateUser(user) {
    return Token.getToken().then((token_hash)=> {
      if(token_hash) {
        HEADER['Authorization'] = token_hash;
        return fetch(`${HOST}/user`, {
            method: 'patch',
            headers: HEADER,
            body: JSON.stringify(user)
          }).then(res=>res.json())
      } else {
        return fetch(`${HOST}/users`, {
          method: 'post',
          headers: HEADER,
          body: JSON.stringify(user)
        }).then(res=> res.json())
      }
    })

  },
  getMain() {
    return fetch(`${HOST}/main`, {
        method: 'get',
        headers: HEADER,
      }).then(res=>res.json())
  },

  getAddress({address, lat, lon}) {
    return Token.getToken().then((token_hash)=> {
      HEADER['Authorization'] = token_hash;
      return fetch(`${HOST}/maps/search?address=${address}&lat=${lat}&lon=${lon}`, {
          method: 'get',
          headers: HEADER,
        }).then(res=>res.json())
    })
  },
  getStationPoints({latitude, longitude, latitudeDelta, longitudeDelta}) {
    return Token.getToken().then((token_hash)=> {
      HEADER['Authorization'] = token_hash;

      //console.log({latitude, longitude, latitudeDelta, longitudeDelta, token_hash})
      return fetch(`${HOST}/maps?lat=${latitude}&lon=${longitude}&latitudeDelta=${latitudeDelta}&longitudeDelta=${longitudeDelta}`, {
          method: 'get',
          headers: HEADER,
        }).then(res=>res.json())
    })
  },
  getStationListPage({latitude, longitude}, page=1) {
    console.log('getStationListPage page' , page, {latitude, longitude})
    return Token.getToken().then((token_hash)=> {
      HEADER['Authorization'] = token_hash;
      return fetch(`${HOST}/stations?lat=${latitude}&lon=${longitude}&page=${page}`, {
          method: 'get',
          headers: HEADER,
        }).then(res=>res.json())
    })
  },
  getStationDetail(id) {

    return Token.getToken().then((token_hash)=> {
      HEADER['Authorization'] = token_hash;
      return fetch(`${HOST}/station/${id}`, {
          method: 'get',
          headers: HEADER,
        }).then(res=>res.json())
    })
  },
  getStationQrCode({ qr }) {
    console.log('getStationQrCode' , qr);

    return Token.getToken().then((token_hash)=> {
      HEADER['Authorization'] = token_hash;
      return fetch(`${HOST}/station/qrcode/${qr}`, {
        method: 'get',
        headers: HEADER,
      }).then(res=>res.json())
    })
  },
  getCards() {
    return Token.getToken().then((token_hash)=> {
      HEADER['Authorization'] = token_hash;
      return fetch(`${HOST}/user/cards`, {
        method: 'get',
        headers: HEADER,
      }).then(res=>res.json())
    })
  },
  createCard({crypto_key, holder_name}) {
    return Token.getToken().then((token_hash)=> {
      HEADER['Authorization'] = token_hash;
      HEADER['Cache-Control'] = 'no-cache';

      return fetch(`${HOST}/user/card`, {
        method: 'post',
        headers: HEADER,
        cache: "no-store",
        body: JSON.stringify({
          crypto_key, 
          holder_name
        })
      }).then(res=> {console.log(res); return res.json()})
    })
  },
  dropCard() {
    return Token.getToken().then((token_hash)=> {
      HEADER['Authorization'] = token_hash;
      return fetch(`${HOST}/user/card`, {
        method: 'delete',
        headers: HEADER,
        body: JSON.stringify({})
      }).then(res=>res.json())
    })
  },
  getRent() {
    return Token.getToken().then((token_hash)=> {
      HEADER['Authorization'] = token_hash;
      return fetch(`${HOST}/rent/status`, {
        method: 'get',
        headers: HEADER,
      }).then(res=>res.json())
    })
  },
  createRent(station_id, payment_type) {
    
    return Token.getToken().then((token_hash)=> {
      HEADER['Authorization'] = token_hash;
      return fetch(`${HOST}/rent`, {
        method: 'post',
        headers: HEADER,
        body: JSON.stringify({station_id, payment_type})
      }).then(res=>res.json())
    })
  },
  getChecks(rent_id) {
    return Token.getToken().then((token_hash)=> {
      HEADER['Authorization'] = token_hash;
      return fetch(`${HOST}/rents/${rent_id}/receipts`, {
        method: 'get',
        headers: HEADER,
      }).then(res=>res.json())
    })
  }
};

module.exports = api;
