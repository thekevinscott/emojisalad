import apn from 'apn';
import getConnection from './getConnection';
import getNotification from './getNotification';
import getDevice from '../../app/websocket/devices/getDevice';

const connection = getConnection({});

const cachedDevices = {};

const getCachedDevice = userKey => {
  return new Promise(resolve => {
    console.info('checking if device is cached for', userKey);
    if (cachedDevices[userKey]) {
      console.info('device is cached', userKey);
      return resolve(cachedDevices[userKey]);
    }

    console.info('device is not cached', userKey);
    return getDevice(userKey).then(({
      device_token: deviceToken,
    }) => {
      console.info('got device token', deviceToken);
      cachedDevices[userKey] = new apn.Device(deviceToken);
      resolve(cachedDevices[userKey]);
    });
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
