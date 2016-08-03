import typeToReducer from 'type-to-reducer';
import R from 'ramda';

// TODO: Fix this import (should pull from index)
import {
  FETCH_GAMES,
} from '../modules/Games/types';

import {
  FETCH_MESSAGES,
  SEND_MESSAGE,
  RECEIVE_MESSAGE,
} from '../modules/Game/types';

const initialState = {};

function translateRound(round = {}) {
  return {
    key: round.key,
    phrase: round.phrase,
    clue: round.clue,
    winner: round.winner,
    submission: round.submission,
    created: round.created,
  };
}

function translateMessages(currentGame = {}, game = {}) {
  const newMessages = (game.messages || []).map(message => message.key);
  const messages = R.uniq((currentGame.messages || []).concat(newMessages));
  return messages;
}

function translateGame(currentGame = {}, game = {}) {
  return {
    key: game.key || currentGame.key,
    created: game.created || currentGame.created,
    archived: game.archived || currentGame.archived,
    round_count: game.round_count || currentGame.round_count,
    players: game.players.map(player => player.user_key) || currentGame.players,
    round: translateRound(game.round || {}) || currentGame.round,
    messages: translateMessages(currentGame, game) || currentGame.messages,
    totalMessages: game.total_messages || currentGame.total_messages,
  };
}

export default typeToReducer({
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
  [SEND_MESSAGE]: {
    FULFILLED: (state, { data }) => {
      const gameKey = data.gameKey;
      const message = data;
      const messages = translateMessages(state[gameKey], {
        messages: [message],
      });
      const game = state[gameKey];
      console.log('game', game);
      console.log('messages length', messages.length);
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
      const gameKey = data.gameKey;
      const message = data;
      const messages = translateMessages(state[gameKey], {
        messages: [message],
      });
      const game = state[gameKey];
      console.log('game', game);
      console.log('messages length', messages.length);
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
