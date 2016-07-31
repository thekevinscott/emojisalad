import typeToReducer from 'type-to-reducer';

// TODO: Fix this import (should pull from index)
import {
  FETCH_GAMES,
} from '../modules/Games/types';

const initialState = {};

const translateMessage = (message) => {
  return {
    body: message.body,
    userKey: message.user_key,
    gameKey: message.game_key,
    timestamp: message.timestamp,
    type: message.type,
  };
};

function getMessagesFromGames(games) {
  return games.reduce((arr, game) => {
    return arr.concat(game.messages);
  }, []);
}

export default typeToReducer({
  [FETCH_GAMES]: {
    FULFILLED: (state, action) => {
      console.log(action.data);
      const messages = getMessagesFromGames(action.data);
      console.log('deez mess', messages);
      return {
        ...state,
        ...messages.reduce((obj, message) => ({
          ...obj,
          [message.key]: translateMessage(message),
        }), {}),
      };
    },
  },
}, initialState);

