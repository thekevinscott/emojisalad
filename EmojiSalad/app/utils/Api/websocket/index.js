import {
  API_PORT,
  API_HOST,
} from '../config';

import error from './error';
import message from './message';
import open from './open';
import close from './close';
import origSendMessage from './sendMessage';

const websocketClass = {
  reconnect: null,
  isOpen: false,
  ws: null,
  set: (key, val) => {
    this[key] = val;
  },
  get: (key) => {
    return this[key];
  },
  initialize: () => {
    console.log('attempt to initialize web socket');
    this.websocket = new WebSocket(`ws://${API_HOST}:${API_PORT}/`);

    this.websocket.onopen = open(websocketClass, () => {
      if (websocketClass.reconnect) {
        clearInterval(websocketClass.reconnect);
      }
    });
    this.websocket.onerror = error();
    this.websocket.onclose = close(websocketClass, () => {
      if (!websocketClass.reconnect) {
        websocketClass.reconnect = setInterval(() => {
          console.log('attempting to reconnect to websocket');
          websocketClass.initialize();
        }, 1000);
      }
    });
  },
};
websocketClass.initialize();

export const sendMessage = origSendMessage(websocketClass);

export function configureWebsocket(store) {
  console.log('configure websocket');
  websocketClass.get('websocket').onmessage = message(store);
}
