//console.log('this line should be re-enabled');
import { Actions } from 'react-native-router-flux';

import {
  FETCH_MESSAGES,
  TRANSITION_TO_GAMES,
  INCREMENT_PAGE,
  SEND_MESSAGE,
  UPDATE_COMPOSE,
  LOAD_EARLIER,
} from './types';

export function fetchMessages(userKey, gameKey, options = {}, meta = {}) {
  const payload = {
    type: FETCH_MESSAGES,
    meta,
    payload: {
      userKey,
      gameKey,
      ...options,
    },
  };
  if (options.before) {
    return dispatch => {
      dispatch({
        type: LOAD_EARLIER,
        gameKey,
      });
      setTimeout(() => {
        dispatch(payload);
      }, 10000);
    };
  }

  return payload;
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
