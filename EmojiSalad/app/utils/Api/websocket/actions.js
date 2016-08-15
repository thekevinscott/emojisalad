import {
  STATUS_UPDATE,
  ATTEMPT_CONNECTION,
} from './types';

export function attemptConnection() {
  return {
    type: ATTEMPT_CONNECTION,
  };
}

export function updateStatus(connected) {
  return {
    type: STATUS_UPDATE,
    connected,
  };
}
