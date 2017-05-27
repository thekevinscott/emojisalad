import typeToReducer from 'type-to-reducer';
import R from 'ramda';

import translateTimestampFromDatabase from 'app/utils/translateTimestampFromDatabase';

import {
  START_NEW_GAME,
} from 'app/pages/NewGame/types';

import {
  FETCH_GAMES,
  CONFIRM_INVITE,
} from 'app/pages/Games/types';

import {
  FETCH_MESSAGES,
  SEND_MESSAGE,
  RECEIVE_MESSAGE,
} from 'app/pages/Game/types';

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
    players: (game.players || []).map(player => player.user_key),
    round: translateRound(game.round || {}) || currentGame.round,
    pendingMessages: currentGame.pendingMessages || [],
    // messages is an array of keys of messages in an unordered list
    messages: translateMessages(currentGame, game) || currentGame.messages || [],
    totalMessages: (game.total_messages !== undefined) ? game.total_messages : currentGame.total_messages,
  };
}

export default typeToReducer({
  [CONFIRM_INVITE]: {
    FULFILLED: (state, { data, meta }) => {
      return {
        ...state,
        [data.gameKey]: translateGame(state[data.gameKey], {
          key: data.gameKey,
          messages: [data],
          totalMessages: 1,
          players: [
            // an invite has at least two players;
            // the inviter, and me
            { user_key: meta.invite.inviter.key },
            { user_key: data.userKey },
          ],
        }),
      };
    },
  },
  [START_NEW_GAME]: {
    FULFILLED: (state, { data }) => {
      return {
        ...state,
        [data.key]: translateGame(state[data.key], data),
      };
    },
  },
  [FETCH_GAMES]: {
    FULFILLED: (state, { data }) => {
      return {
        ...data.reduce((obj, el) => {
          //if (el.type === 'invite') {
            //const game = {
              //...el.game,
              //messages: el.messages,
            //};
            //return {
              //...obj,
              //[game.key]: translateGame(state[game.key], game),
            //};
          //}

          if (el.type === 'game') {
            return {
              ...obj,
              [el.key]: translateGame(state[el.key], el),
            };
          }

          return obj;
        }, {}),
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
    FULFILLED: (state, { data, meta }) => {
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
          pendingMessages: game.pendingMessages.filter(pendingKey => {
            return pendingKey !== meta.pendingKey;
          }),
          totalMessages: game.totalMessages + 1,
        },
      };
    },
  },
  [RECEIVE_MESSAGE]: {
    FULFILLED: (state, { data }) => {
      //const messageKey = data.messageKey;
      const gameKey = data.gameKey;
      const message = data;
      const messages = translateMessages(state[gameKey], {
        messages: [message],
      });
      const game = {
        key: gameKey,
        ...state[gameKey],
      };

      //if (messageKey === 'invite') {
        //return {
          //...state,
          //[gameKey]: {
            //...game,
            //messages,
            //totalMessages: (game.totalMessages || 0) + 1,
          //},
        //};
      //}

      return {
        ...state,
        [gameKey]: {
          ...game,
          messages,
          totalMessages: (game.totalMessages || 0) + 1,
        },
      };
    },
  },
}, initialState);
