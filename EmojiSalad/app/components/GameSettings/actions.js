import {
  UPDATE_GAME,
} from './types';

export const updateGame = (game, params) => dispatch => {
  return dispatch({
    type: UPDATE_GAME,
    payload: {
      gameKey: game.key,
      params,
    },
  });
};
