import apn from 'apn';
import getConnection from './getConnection';
import getNotification from './getNotification';
import getDevice from '../../app/websocket/devices/getDevice';

const connection = getConnection({});

const cachedDevices = {};

const getCachedDevice = userKey => {
  return new Promise(resolve => {
    if (cachedDevices[userKey]) {
      return resolve(cachedDevices[userKey]);
    }

    return resolve(getDevice(userKey).then(token => {
      cachedDevices[userKey] = new apn.Device(token);
      resolve(cachedDevices[userKey]);
    }));
  });
};


export default function sendNotification(userKey, body, options = {}) {
  getCachedDevice(userKey).then(device => {
    console.info('got device', device);
    const note = getNotification(body, options);
    console.info('got note', note);
    connection.pushNotification(note, device);
    console.info(`sent ${note.alert.body} on ${device}`);
  });
}
