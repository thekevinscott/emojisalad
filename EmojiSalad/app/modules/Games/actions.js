import Api from '../../utils/Api';
import { Actions } from 'react-native-router-flux';

import {
  FETCH_GAMES,
} from './types';

export function fetchGames(user) {
  return {
    type: FETCH_GAMES,
    payload: Api.fetch(`games?user_id=${user.id}`).then(response => {
      return response;
    }).catch(err => {
      console.log('swallow this');
    }),
  };
}
