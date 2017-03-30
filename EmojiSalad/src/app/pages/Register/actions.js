import { Actions } from 'react-native-router-flux';

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
  //console.log('action games 3');
  Actions.games();
  return {
    type: TRANSITION_TO_GAMES,
  };
}
