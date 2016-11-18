import typeToReducer from 'type-to-reducer';
import Sound from 'react-native-simple-sound';

import translateTimestampFromDatabase from '../../utils/translateTimestampFromDatabase';

import {
  FETCH_GAMES,
} from 'app/pages/Games/types';

import {
  FETCH_MESSAGES,
  SEND_MESSAGE,
  RECEIVE_MESSAGE,
} from 'app/pages/Game/types';

Sound.enable(true);
const sounds = [
  {
    key: 'send',
    path: 'send.aif',
  },
  {
    key: 'received',
    path: 'receive.aif',
  },
  {
    key: 'welcome',
    path: 'welcome.aif',
  },
].reduce((obj, {
  key,
  path,
}) => {
  Sound.prepare(path);
  return {
    ...obj,
    [key]: {
      play: () => Sound.play(path),
    },
  };
}, {});

const initialState = {};

const translateMessage = (message) => {
  return {
    body: message.body,
    userKey: message.user_key,
    gameKey: message.game_key,
    timestamp: translateTimestampFromDatabase(message.timestamp),
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
      if (messages.length !== Object.keys(state).length) {
        sounds.received.play();
      }
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
  [SEND_MESSAGE]: {
    FULFILLED: (state, action) => {
      sounds.send.play();
      return buildMessageObj(state, [action.data]);
    },
  },
  [RECEIVE_MESSAGE]: {
    FULFILLED: (state, action) => {
      sounds.received.play();
      return buildMessageObj(state, [action.data]);
    },
  },
}, initialState);

sounds.welcome.play();
