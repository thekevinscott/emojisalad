import {
  UPDATE_TOKEN,
} from './actions';

export function updateToken(token) {
  return {
    type: UPDATE_TOKEN,
    token,
  };
}
