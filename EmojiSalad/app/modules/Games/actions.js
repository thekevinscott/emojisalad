//import Api from '../../utils/Api';
//import { Actions } from 'react-native-router-flux';

import {
  FETCH_GAMES,
} from './types';

export function fetchGames(userId) {
  return {
    type: FETCH_GAMES,
    payload: {
      userId,
    },
  };
  /*
  return {
    type: FETCH_GAMES,
    payload: Api.fetch(`games?user_id=${userId}`).then(response => {
      return response;
    }).catch(err => {
      console.log('swallow this');
    }),
  };
  */
}
