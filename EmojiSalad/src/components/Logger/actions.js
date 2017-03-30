import {
  UPDATE_LOGGER,
} from './types';

export function update(msg) {
  return dispatch => {
    return dispatch({
      type: UPDATE_LOGGER,
      logger: msg,
    });
  };
}
