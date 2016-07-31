import typeToReducer from 'type-to-reducer';

import {
  FETCH_GAMES,
} from '../modules/Games/types';

import {
  FETCH_MESSAGES,
} from '../modules/Game/types';

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

function buildMessageObj(state, messages) {
  return {
    ...state,
    ...messages.reduce((obj, message) => ({
      ...obj,
      [message.key]: translateMessage(message),
    }), {}),
  };
}

export default typeToReducer({
  [FETCH_MESSAGES]: {
    FULFILLED: (state, { data }) => {
      const messages = data.messages;
      return buildMessageObj(state, messages);
    },
  },
  [FETCH_GAMES]: {
    FULFILLED: (state, action) => {
      //console.log(action.data);
      const messages = getMessagesFromGames(action.data);
      return buildMessageObj(state, messages);
    },
  },
}, initialState);

