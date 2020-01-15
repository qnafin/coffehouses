import CryptoJS from "crypto-js";
import moment from "moment"
const SHA256 = require("crypto-js/sha256");
import { Client, Message } from 'react-native-paho-mqtt';

export const a = 'true'

const sha256 = (msg) => {
    const hash = SHA256(msg);
    return hash.toString(CryptoJS.enc.Hex);
};

const sign = (key, msg) => {
    let hash = CryptoJS.HmacSHA256(msg, key);
    return hash.toString(CryptoJS.enc.Hex);
};

const getSignatureKey = (key, dateStamp, regionName, serviceName) => {
    const kDate = CryptoJS.HmacSHA256(dateStamp, 'AWS4' + key);
    const kRegion = CryptoJS.HmacSHA256(regionName, kDate);
    const kService = CryptoJS.HmacSHA256(serviceName, kRegion);
    const kSigning = CryptoJS.HmacSHA256('aws4_request', kService);
    return kSigning;
};

const computeWebSocketUrl = ({host, region, secretKey, accessKey}) => {
    // const region = regionName;
    // const secretKey = secretKey;
    // const accessKey = accessKey;
    // const host = host;
    
    const time = moment.utc();
    const dateStamp = time.format('YYYYMMDD');
    const amzdate = dateStamp + 'T' + time.format('HHmmss') + 'Z';
    const service = 'iotdevicegateway';

    const algorithm = 'AWS4-HMAC-SHA256';
    const method = 'GET';
    const canonicalUri = '/mqtt';
    const credentialScope = dateStamp + '/' + region + '/' + service + '/' + 'aws4_request';
    let canonicalQuerystring = 'X-Amz-Algorithm=AWS4-HMAC-SHA256';
    canonicalQuerystring += '&X-Amz-Credential=' + encodeURIComponent(accessKey + '/' + credentialScope);
    canonicalQuerystring += '&X-Amz-Date=' + amzdate;
    canonicalQuerystring += '&X-Amz-Expires=86400';
    canonicalQuerystring += '&X-Amz-SignedHeaders=host';
    const canonicalHeaders = 'host:' + host + '\n';
    const payloadHash = sha256('');
    const canonicalRequest =
      method + '\n' + canonicalUri + '\n' + canonicalQuerystring + '\n' + canonicalHeaders + '\nhost\n' + payloadHash;
    const stringToSign = algorithm + '\n' + amzdate + '\n' + credentialScope + '\n' + sha256(canonicalRequest);
    const signingKey = getSignatureKey(secretKey, dateStamp, region, service);
    const signature = sign(signingKey, stringToSign);
    canonicalQuerystring += '&X-Amz-Signature=' + signature;
    const requestUrl = 'wss://' + host + canonicalUri + '?' + canonicalQuerystring;
    return requestUrl;
};


//Set up an in-memory alternative to global localStorage
const myStorage = {
  setItem: (key, item) => {
    myStorage[key] = item;
  },
  getItem: (key) => myStorage[key],
  removeItem: (key) => {
    delete myStorage[key];
  },
};

export const createClient = ({clientId, room}) => {
  // Create a client instance
  const client = new Client({ 
    uri: computeWebSocketUrl({
      host: "ar9lh4nupt6gt-ats.iot.us-east-1.amazonaws.com", 
      region: "us-east-1", 
      secretKey: "YVrb2sCtPSyducdMXEGaZhesrAMpBx7WNZzkNUUa", 
      accessKey: "AKIAIHOXGOUQGIVR4AOQ"
    }), 
    clientId: clientId, 
    storage: myStorage
  });

  //set event handlers
  client.on('connectionLost', (responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.log(responseObject.errorMessage);
      client.connect()
        .then(() => {
          // Once a connection has been made, make a subscription and send a message.
          console.log('onConnect');
          return client.subscribe(room);
        })
    }
  });
  // client.on('messageReceived', (message) => {
  //   console.log('message', message.payloadString);
  // });

  // connect the client
  client.connect()
    .then(() => {
      // Once a connection has been made, make a subscription and send a message.
      console.log('onConnect');
      return client.subscribe(room);
    })
    .then(() => {
      // const message = new Message('Включи тариф day | hour | trial');
      // message.destinationName = 'test';
      // client.send(message);
    })
    .catch((responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log('onConnectionLost:' + responseObject);
      }
    });

    return client;
}
