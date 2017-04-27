import {
  REQUEST_DEVICE_PUSH_ID,
} from './types';

const requestDevicePushId = () => {
  return {
    type: REQUEST_DEVICE_PUSH_ID,
    data: {},
  };
};

export default requestDevicePushId;
