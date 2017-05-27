import getDevice from './devices/getDevice';
import requestDeviceInfo from './devices/requestDeviceInfo';
//import requestDevicePushId from './devices/requestDevicePushId';
import _sendMessage from './sendMessage';

const getPromises = (ws, {
  device_info: deviceInfo,
  push_id: pushId,
}) => {
  const promises = [];

  if (!deviceInfo || !deviceInfo.systemName) {
    promises.push(requestDeviceInfo());
  }

  //if (!pushId) {
    //promises.push(requestDevicePushId());
  //}

  return promises;
};

const postChecks = (ws, { payload }) => {
  const {
    userKey,
  } = payload;

  console.log('payload for post checks', payload);
  const sendMessage = _sendMessage(ws);

  return getDevice(userKey).then(device => {
    //console.info('the fetched device', device);
    return Promise.all(getPromises(ws, device));
  }).then(requestsToMake => {
    //console.info('requests to make', requestsToMake);
    if (requestsToMake.length) {
      requestsToMake.forEach(request => {
        sendMessage(request);
      });
    }
  }).catch(err => {
    if (err.code === 1) {
      console.info(`no devices found for ${userKey}, request info`);
      // this means no devices are found
      // we should ask to populate the device
      sendMessage(requestDeviceInfo());
    } else if (err.code === 2) {
      // this means multiple devices are found
    } else {
      console.error('error in post checks', err);
    }
  });
};

export default postChecks;
