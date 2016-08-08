//console.log('this line should be re-enabled');
import { Actions } from 'react-native-router-flux';

import {
  FETCH_MESSAGES,
  TRANSITION_TO_GAMES,
  INCREMENT_PAGE,
  SEND_MESSAGE,
  UPDATE_COMPOSE,
} from './types';

export function fetchMessages(userKey, gameKey, messageKeysToExclude) {
  return {
    type: FETCH_MESSAGES,
    payload: {
      userKey,
      gameKey,
      messageKeysToExclude,
    },
  };
}

export function goToGames() {
  Actions.games();
  return {
    type: TRANSITION_TO_GAMES,
  };
}

export function incrementPage(gameKey) {
  return {
    type: INCREMENT_PAGE,
    gameKey,
  };
}

export function sendMessage(userKey, gameKey, message) {
  return {
    type: SEND_MESSAGE,
    payload: {
      userKey,
      gameKey,
      message,
    },
  };
}

export function updateCompose(gameKey, text) {
  return {
    type: UPDATE_COMPOSE,
    gameKey,
    text,
  };
}
