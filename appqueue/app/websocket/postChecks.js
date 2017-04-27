import getDevice from './devices/getDevice';
import requestDeviceInfo from './devices/requestDeviceInfo';
import requestDevicePushId from './devices/requestDevicePushId';
import _sendMessage from './sendMessage';

const getPromises = (ws, {
  device_info: deviceInfo,
  push_id: pushId,
}) => {
  const promises = [];

  if (!deviceInfo || !deviceInfo.systemName) {
    promises.push(requestDeviceInfo());
  }

  if (!pushId) {
    promises.push(requestDevicePushId());
  }

  return promises;
};

const postChecks = (ws, { payload }) => {
  const {
    userKey,
  } = payload;

  //console.log('payload for post checks', payload);

  return getDevice(userKey).then(device => {
    console.info('the fetched device', device);
    return Promise.all(getPromises(ws, device));
  }).then(requestsToMake => {
    console.info('requests to make', requestsToMake);
    if (requestsToMake.length) {
      const sendMessage = _sendMessage(ws);
      requestsToMake.forEach(request => {
        sendMessage(request);
      });
    }
  }).catch(err => {
    console.error('error in post checks', err);
  });
};

export default postChecks;
