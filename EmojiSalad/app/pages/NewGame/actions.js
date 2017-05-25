import { Actions } from 'react-native-router-flux';
//import {
  //update as updateLogger,
//} from 'components/Logger/actions';

import {
  START_NEW_GAME,
} from './types';

export const startGame = (userKey, players) => dispatch => dispatch(() => {
  //dispatch(updateLogger(`start new game with user key: ${userKey} and phones: ${JSON.stringify(phones)}`));

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
});

