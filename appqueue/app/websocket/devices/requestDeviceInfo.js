import {
  REQUEST_DEVICE_INFO,
} from './types';

const requestDeviceInfo = () => {
  return {
    type: REQUEST_DEVICE_INFO,
    data: {},
  };
};

export default requestDeviceInfo;
