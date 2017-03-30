/*
 * Provides a synchronous wrapper around NetInfo,
 * for use in middleware and other goodies.
 */
import {
  NetInfo,
} from 'react-native';

const VALID_STATII = [
  'wifi',
  'cell',
];

let status;
const callbacks = [];

const isConnected = () => VALID_STATII.indexOf(status) !== -1;

const updateStatus = reach => {
  status = reach;
  if (isConnected() && callbacks.length) {
    callbacks.map(fn => fn());
  }
};

NetInfo.fetch().done(updateStatus);
NetInfo.addEventListener(
  'change',
  updateStatus,
);

const Network = {
  hasConnection: () => isConnected(),
  onConnect: callback => {
    if (isConnected()) {
      callback();
    }
    callbacks.push(callback);
  },
};

export default Network;
