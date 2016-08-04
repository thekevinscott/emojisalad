import {
  API_PORT,
  API_HOST,
} from '../../../../config';

import error from './error';
import message from './message';
import open from './open';
import close from './close';
import origSendMessage from './sendMessage';

const websocketClass = {
  reconnect: null,
  isOpen: false,
  ws: null,
  store: null,
  set: (key, val) => {
    this[key] = val;
  },
  get: (key) => {
    return this[key];
  },
  log: (msg) => {
    this.msg = msg;
    console.log('Logger', msg);
    if (websocketClass.store) {
      this.lastMsg = null;
      console.log('store is dispatched');
      websocketClass.store.dispatch({
        type: 'UPDATE_LOGGER',
        logger: msg,
      });
    } else {
      this.lastMsg = msg;
      //console.log('store is not yet attached');
    }
  },
  setLogger: () => {
    if (this.lastMsg) {
      websocketClass.store.dispatch({
        type: 'UPDATE_LOGGER',
        logger: this.lastMsg,
      });
      this.lastMsg = null;
    }
  },
  attempts: 0,
  initialize: () => {
    websocketClass.attempts = websocketClass.attempts + 1;
    websocketClass.log(`attempting to connect websocket at ws://${API_HOST}:${API_PORT}/, attempt ${websocketClass.attempts}`);
    this.websocket = new WebSocket(`ws://${API_HOST}:${API_PORT}/`);

    if (websocketClass.store) {
      websocketClass.get('websocket').onmessage = message(websocketClass.store);
    }
    this.websocket.onopen = open(websocketClass, () => {
      if (websocketClass.reconnect) {
        clearInterval(websocketClass.reconnect);
        websocketClass.reconnect = null;
      }
      websocketClass.attempts = 0;
    });
    this.websocket.onerror = error(websocketClass);
    this.websocket.onclose = close(websocketClass, () => {
      websocketClass.log('websocket closed');
      if (!websocketClass.reconnect) {
        websocketClass.reconnect = setInterval(() => {
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
  websocketClass.store = store;
  websocketClass.get('websocket').onmessage = message(store);
  websocketClass.setLogger(store.dispatch);
}

export const attachLogger = websocketClass.attachLogger;
