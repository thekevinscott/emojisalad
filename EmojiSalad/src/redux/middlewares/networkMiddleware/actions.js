import {
  UPDATE_STATUS,
} from './types';

export function updateStatus(status) {
  return {
    type: UPDATE_STATUS,
    status,
  };
}
