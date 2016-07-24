import Api from '../../utils/Api';
import { Actions } from 'react-native-router-flux';

import {
  FETCH_MESSAGES,
  TRANSITION_TO_GAMES,
} from './types';

export function fetchMessages(gameId) {
  return {
    type: FETCH_MESSAGES,
    payload: Api.socketSend({
      type: FETCH_MESSAGES,
      userId: 23,
    }),
  };
}

export function goToGames() {
  Actions.games();
  return {
    type: TRANSITION_TO_GAMES,
  };
}
