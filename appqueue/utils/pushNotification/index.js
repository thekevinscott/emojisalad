import apn from 'apn';
import getConnection from './getConnection';
import getNotification from './getNotification';

const connection = getConnection({});

const cachedDevices = {};

const getDevice = token => {
  if (!cachedDevices[token]) {
    cachedDevices[token] = new apn.Device(token);
  }

  return cachedDevices[token];
};


export default function sendNotification(token, body, options = {}) {
  const myDevice = getDevice(token);
  const note = getNotification(body, options);
  console.info(`sent ${note.alert.body} on ${token}`);

  connection.pushNotification(note, myDevice);
}
