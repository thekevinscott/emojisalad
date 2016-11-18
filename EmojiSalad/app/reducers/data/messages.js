import typeToReducer from 'type-to-reducer';
//import Sound from 'react-native-sound';

import translateTimestampFromDatabase from '../../utils/translateTimestampFromDatabase';

import {
  FETCH_GAMES,
} from 'app/pages/Games/types';

import {
  FETCH_MESSAGES,
  SEND_MESSAGE,
  RECEIVE_MESSAGE,
} from 'app/pages/Game/types';

//const sounds = [
  //{
    //key: 'send',
    //path: 'send.wav',
  //},
  //{
    //key: 'received',
    //path: 'received.wav',
  //},
//].reduce((obj, {
  //key,
  //path,
//}) => {
  //return {
    //...obj,
    //[key]: new Sound(path, Sound.MAIN_BUNDLE, (error) => {
      //if (error) {
        //console.log('failed to load the sound', key, path, error);
      //}
    //}),
  //};
//}, {});

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
      //sounds.send.play();
      return buildMessageObj(state, [action.data]);
    },
  },
  [RECEIVE_MESSAGE]: {
    FULFILLED: (state, action) => {
      //sounds.received.play();
      return buildMessageObj(state, [action.data]);
    },
  },
}, initialState);

//console.log('play sound', sounds);
//sounds.send.play(success => {
  //console.log('whu', success);
//});
//const w = new Sound('send.wav', Sound.MAIN_BUNDLE, (error) => {
  //console.log('err', error);
//});
//w.play(success => {
  //console.log('whu', success);
//});
//console.log('afterwards');
