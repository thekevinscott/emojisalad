import { Actions } from 'react-native-router-flux';
import {
  update as updateLogger,
} from 'components/Logger/actions';

import {
  FETCH_GAMES,
  OPEN_GAME,
  UPDATE_STARTING_MESSAGE,
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
