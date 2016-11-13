//console.log('this line should be re-enabled');
import { Actions } from 'react-native-router-flux';
import {
  update as updateLogger,
} from '../../components/Logger/actions';

import {
  FETCH_MESSAGES,
  TRANSITION_TO_GAMES,
  INCREMENT_PAGE,
  SEND_MESSAGE,
  UPDATE_COMPOSE,
  LOAD_EARLIER,
} from './types';

export function fetchMessages(userKey, gameKey, options = {}, meta = {}) {
  return dispatch => {
    dispatch(updateLogger(`fetch messages with game key: ${gameKey}`));
    const payload = {
      type: FETCH_MESSAGES,
      meta: {
        ...meta,
        gameKey,
        userKey,
      },
      payload: {
        userKey,
        gameKey,
        ...options,
      },
    };

    if (options.before) {
      // TODO: WTF IS THIS??
      console.log('Yo what the FUCK is this code? Who the fuck wrote this? (Kevin did)');
      setTimeout(() => {
        dispatch(payload);
      }, 1000);

      return dispatch({
        type: LOAD_EARLIER,
        gameKey,
      });
    }

    return dispatch(payload);
  };
}

export function goToGames() {
  //console.log('action games 2');
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
    meta: {
      pendingKey: Math.random(),
    },
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
