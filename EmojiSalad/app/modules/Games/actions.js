//import Api from '../../utils/Api';
//import { Actions } from 'react-native-router-flux';

import {
  FETCH_GAMES,
} from './types';

export function fetchGames(userKey) {
  return {
    type: FETCH_GAMES,
    payload: {
      userKey,
    },
  };
}
