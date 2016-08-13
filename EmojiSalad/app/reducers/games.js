import typeToReducer from 'type-to-reducer';
import R from 'ramda';
import {
  Vibration,
} from 'react-native';

import translateTimestampFromDatabase from '../utils/translateTimestampFromDatabase';

// TODO: Fix this import (should pull from index)
import {
  FETCH_GAMES,
} from '../modules/Games/types';

import {
  FETCH_MESSAGES,
  SEND_MESSAGE,
  RECEIVE_MESSAGE,
} from '../modules/Game/types';

export const initialState = {};

function translateRound(round = {}) {
  return {
    key: round.key,
    phrase: round.phrase,
    clue: round.clue,
    winner: round.winner,
    submission: round.submission,
    timestamp: translateTimestampFromDatabase(round.created),
  };
}

function getMessageKeys(messages = []) {
  return messages.map(message => message.key);
}

function translateMessages(currentGame = {}, game = {}) {
  const newMessageKeys = getMessageKeys(game.messages);
  return R.uniq((currentGame.messages || []).concat(newMessageKeys));
}


function translateGame(currentGame = {}, game = {}) {
  const timestamp = translateTimestampFromDatabase(game.created) || currentGame.timestamp;
  return {
    key: game.key || currentGame.key,
    timestamp,
    archived: (game.archived !== undefined) ? game.archived : currentGame.archived,
    roundCount: (game.round_count !== undefined) ? game.round_count : currentGame.round_count,
    players: game.players.map(player => player.user_key) || currentGame.players,
    round: translateRound(game.round || {}) || currentGame.round,
    pendingMessages: currentGame.pendingMessages || [],
    // messages is an array of keys of messages in an unordered list
    messages: translateMessages(currentGame, game) || currentGame.messages || [],
    totalMessages: (game.total_messages !== undefined) ? game.total_messages : currentGame.total_messages,
  };
}

export default typeToReducer({
  [FETCH_GAMES]: {
    FULFILLED: (state, action) => {
      return {
        ...state,
        ...action.data.reduce((obj, game) => ({
          ...obj,
          [game.key]: translateGame(state[game.key], game),
        }), {}),
      };
    },
  },
  // fetch messages for a specific game
  [FETCH_MESSAGES]: {
    FULFILLED: (state, { data }) => {
      const gameKey = data.key;
      const messages = translateMessages(state[gameKey], {
        messages: data.messages,
      });
      return {
        ...state,
        [gameKey]: {
          ...state[gameKey],
          messages,
        },
      };
    },
  },
  [SEND_MESSAGE]: {
    PENDING: (state, { payload, meta }) => {
      const {
        gameKey,
      } = payload;

      const {
        pendingKey,
      } = meta;

      const game = state[gameKey];

      const pendingMessages = (game.pendingMessages || []).concat(pendingKey);

      return {
        ...state,
        [gameKey]: {
          ...game,
          pendingMessages,
        },
      };
    },
    FULFILLED: (state, action) => {
      const data = action.data;
      const gameKey = data.gameKey;
      const message = data;
      const messages = translateMessages(state[gameKey], {
        messages: [message],
      });
      const game = state[gameKey];
      return {
        ...state,
        [gameKey]: {
          ...game,
          messages,
          totalMessages: game.totalMessages + 1,
        },
      };
    },
  },
  [RECEIVE_MESSAGE]: {
    FULFILLED: (state, { data }) => {
      Vibration.vibrate();
      const gameKey = data.gameKey;
      const message = data;
      const messages = translateMessages(state[gameKey], {
        messages: [message],
      });
      const game = state[gameKey];
      return {
        ...state,
        [gameKey]: {
          ...game,
          messages,
          totalMessages: game.totalMessages + 1,
        },
      };
    },
  },
}, initialState);
