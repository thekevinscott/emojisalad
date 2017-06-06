const getDeviceToken = state => {
  return state.data.me.pushData;
};

export default getDeviceToken;
