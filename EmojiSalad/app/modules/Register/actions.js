import Api from '../../utils/Api';
import { Actions } from 'react-native-router-flux';

import device from '../../utils/device';

import {
  SUBMIT_CLAIM,
  UPDATE_TEXT,
} from './types';

export function submitClaim(text) {
  return {
    type: SUBMIT_CLAIM,
    text,
    payload: Api.fetch('claim', {
      method: 'post',
      body: {
        text,
        device,
      },
    }).then(response => {
      Actions.games();
      return response;
    }),
  };
}

export function updateText(text) {
  return {
    type: UPDATE_TEXT,
    text,
  };
}
