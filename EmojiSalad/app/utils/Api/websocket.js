import {
  API_PORT,
  API_HOST,
} from './config';

import {
  Alert,
} from 'react-native';

import {
  SUBMIT_CLAIM,
} from '../../modules/Register/types';

const ws = new WebSocket(`ws://${API_HOST}:${API_PORT}/`);

let isOpen = false;
const messages = [];

// TODO: How to keep this up to date with the server?
const TYPES = {
  [SUBMIT_CLAIM]: 'CLAIM',
  [`${SUBMIT_CLAIM}_REJECTED`]: 'CLAIM_REJECTED',
};
const API_TYPES = Object.keys(TYPES).reduce((obj, key) => {
  const val = TYPES[key];
  return Object.assign({}, obj, {
    [val]: key,
  });
}, {});

const getType = (type) => {
  return TYPES[type] || type;
};

const toType = (type) => {
  return API_TYPES[type] || type;
};

export function sendMessage(type, payload) {
  console.log('socket sending time');
  if (isOpen) {
    console.log('send the socket', payload);
    const packet = JSON.stringify({
      type: getType(type),
      payload,
    });
    console.log(packet);
    ws.send(packet);
  } else {
    console.log('queue payload for later');
    messages.push(payload);
  }
}

function sendAnyMessages() {
  console.log('send ', messages.length, 'messages');
  while (messages.length > 0) {
    const message = messages.shift();
    sendMessage(message);
  }
}

ws.onopen = () => {
  isOpen = true;
  sendAnyMessages();
  console.log('web socket connection live');
  // connection opened
};

ws.onerror = (e) => {
  // an error occurred
  console.log('an error from web socket', e.message);
};

ws.onclose = (e) => {
  Alert.alert(
    'Websocket has gone away',
    `Websocket has closed: ${e.code} ${e.reason}`,
  );
  isOpen = false;
  // connection closed
  console.log('websocket has closed', e.code, e.reason);
};

export function configureWebsocket(store) {
  console.log('configure websocket');
  ws.onmessage = (e) => {
    try {
      console.log('got a message back', e);
      const payload = JSON.parse(e.data);
      console.log('data', payload);
      const data = JSON.parse(payload.data);
      const type = payload.type;
      if (!type) {
        console.log('no type for payload', Object.keys(payload));
      } else {
        store.dispatch({
          type: toType(type),
          data,
        });
      }
    } catch (err) {
      console.error('payload could not be parsed', e.data, err);
    }
  };
}
