//import Api from '../../utils/Api';
import { Actions } from 'react-native-router-flux';

import {
  FETCH_MESSAGES,
  TRANSITION_TO_GAMES,
  INCREMENT_PAGE,
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
