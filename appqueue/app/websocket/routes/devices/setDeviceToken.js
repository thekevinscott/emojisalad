const setDeviceToken = (ws, message) => {
  console.log('set the device token', message);
  return new Promise(resolve => {
    resolve('good job');
  });
};

export default setDeviceToken;
