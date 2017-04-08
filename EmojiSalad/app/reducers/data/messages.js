import typeToReducer from 'type-to-reducer';
//import Sound from 'react-native-simple-sound';
import {
  Vibration,
} from 'react-native';

import translateTimestampFromDatabase from '../../utils/translateTimestampFromDatabase';

import {
  FETCH_GAMES,
} from 'app/pages/Games/types';

import {
  FETCH_MESSAGES,
  SEND_MESSAGE,
  RECEIVE_MESSAGE,
} from 'app/pages/Game/types';

//Sound.enable(true);
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
  {
    key: 'airhorn',
    path: 'airhorn.mp3',
  },
].reduce((obj, {
  key,
  path,
}) => {
  //Sound.prepare(path);
  return {
    ...obj,
    [key]: {
      //play: () => Sound.play(path),
    },
  };
}, {});

const initialState = {};

const translateMessage = (message) => {
  console.log('message', message);
  return {
    //messageKey: message.message_key,
    body: message.body,
    userKey: message.user_key,
    gameKey: message.game_key,
    timestamp: translateTimestampFromDatabase(message.timestamp),
    type: message.type,
  };
};

function getMessagesFromGames(rows) {
  return rows.map(row => {
    return row.messages;
  }).reduce((arr, messages) => {
    return arr.concat(messages);
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
  [SEND_MESSAGE]: {
    FULFILLED: (state, action) => {
      if (action.data.body.toLowerCase() === 'airhorn') {
        //sounds.airhorn.play();
      } else {
        //sounds.send.play();
      }
      return buildMessageObj(state, [action.data]);
    },
  },
  [RECEIVE_MESSAGE]: {
    FULFILLED: (state, action) => {
      Vibration.vibrate();
      if (action.data.body.toLowerCase() === 'airhorn') {
        //sounds.airhorn.play();
      } else {
        //sounds.received.play();
      }
      return buildMessageObj(state, [action.data]);
    },
  },
}, initialState);

//sounds.welcome.play();
