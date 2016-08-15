//import Api from '../../utils/Api';
import { Actions } from 'react-native-router-flux';

import {
  FETCH_GAMES,
  OPEN_GAME,
  UPDATE_STARTING_MESSAGE,
} from './types';

export function fetchGames(userKey) {
  return {
    type: FETCH_GAMES,
    payload: {
      userKey,
    },
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
