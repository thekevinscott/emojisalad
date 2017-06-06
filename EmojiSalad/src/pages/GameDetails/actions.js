//import { Actions } from 'react-native-router-flux';
//import {
  //update as updateLogger,
//} from 'components/Logger/actions';

import {
  INVITE_TO_GAME,
} from './types';

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