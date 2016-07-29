import { Actions } from 'react-native-router-flux';

import device from '../../utils/device';

import {
  SUBMIT_CLAIM,
  UPDATE_TEXT,
  TRANSITION_TO_GAMES,
} from './types';

export function submitClaim(text) {
  return {
    type: SUBMIT_CLAIM,
    payload: {
      text,
      device,
    },
  };
}

export function updateText(text) {
  return {
    type: UPDATE_TEXT,
    text,
  };
}

export function goToGames() {
  Actions.games();
  return {
    type: TRANSITION_TO_GAMES,
  };
}
