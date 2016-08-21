import {
  REQUEST_DEVICE_TOKEN,
} from './types';

const requestDeviceToken = () => {
  return {
    type: REQUEST_DEVICE_TOKEN,
    data: {},
  };
};

export default requestDeviceToken;

