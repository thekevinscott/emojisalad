import { Actions } from 'react-native-router-flux';
import {
  update as updateLogger,
} from 'components/Logger/actions';

import {
  FETCH_GAMES,
  OPEN_GAME,
  UPDATE_STARTING_MESSAGE,
  PAUSE_GAME,
  LEAVE_GAME,
} from './types';

export function fetchData(userKey) {
  return dispatch => {
    dispatch(updateLogger(`fetch data with user key: ${userKey}`));
    return dispatch({
      type: FETCH_GAMES,
      payload: {
        userKey,
      },
    });
  };
}

export function openGame(game, games) {
  return dispatch => {
    Actions.game({
      game,
    });

    dispatch({
      type: OPEN_GAME,
      game,
      games,
    });
  };
}

export function updateStartingMessage(game) {
  return {
    type: UPDATE_STARTING_MESSAGE,
    game,
  };
}

export const pauseGame = (user, game) => dispatch => dispatch(() => {
  return dispatch({
    type: PAUSE_GAME,
    payload: {
      userKey: user.key,
      gameKey: game.key,
    },
  });
});

export const leaveGame = (user, game) => dispatch => dispatch(() => {
  return dispatch({
    type: LEAVE_GAME,
    payload: {
      userKey: user.key,
      gameKey: game.key,
    }
  });
});
