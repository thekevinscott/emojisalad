import { Actions } from 'react-native-router-flux';
//import {
  //update as updateLogger,
//} from 'components/Logger/actions';

import {
  START_NEW_GAME,
  UPDATE_GAME,
  INVITE_TO_GAME,
} from './types';

export const startGame = ({ userKey, players }) => dispatch => {
  debugger;
  return dispatch({
    type: START_NEW_GAME,
    payload: {
      userKey,
      players: Object.keys(players).map(key => {
        return players[key];
      }),
    },
  }).then(() => {
    Actions.pop();
  });
};

export const updateGame = (game, params) => dispatch => {
  debugger;
  return dispatch({
    type: UPDATE_GAME,
    payload: {
      gameKey: game.key,
      params,
    },
  });
};

export const saveGame = (game, params) => dispatch => {
  if (game && game.key) {
    return dispatch(updateGame(game, params));
  }

  return dispatch(startGame(params));
};

/*
export const inviteToGame = (userKey, game, player) => dispatch => {
  return dispatch({
    type: INVITE_TO_GAME,
    meta: {
      userKey,
      gameKey: game.key,
      players: [player],
    },
    payload: {
      userKey,
      gameKey: game.key,
      players: [{
        facebookId: player.id,
      }],
    },
  });
};
*/
