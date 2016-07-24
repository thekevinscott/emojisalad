import {
  API_PORT,
  API_HOST,
} from './config';

import {
  Alert,
} from 'react-native';

const ws = new WebSocket(`ws://${API_HOST}:${API_PORT}/`);

let isOpen = false;
const messages = [];

export function socketSend(payload) {
  console.log('socket sending time');
  if (isOpen) {
    console.log('send the socket');
    ws.send(JSON.stringify(payload));
  } else {
    console.log('queue payload for later');
    messages.push(payload);
  }
}

function sendAnyMessages() {
  console.log('send ', messages.length, 'messages');
  while (messages.length > 0) {
    const message = messages.shift();
    socketSend(message);
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
    const data = JSON.parse(e.data);
    const payload = data.payload;
    if (!data.type) {
      console.log('no type for payload', Object.keys(data));
    } else {
      store.dispatch({
        type: data.type,
        payload,
      });
    }
  };
}
