import {
  API_PORT,
  API_HOST,
} from '../../../../config';

//import error from './error';
import message from './message';
import open from './open';
import close from './close';
import origSendMessage from './sendMessage';

import {
  WEBSOCKET_CONNECT,
} from './types';

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
    console.log(msg);
    websocketClass.dispatch({
      type: 'UPDATE_LOGGER',
      logger: msg,
    });
  },
  setStore: (store) => {
    websocketClass.store = store;
    if (websocketClass.toDispatch.length) {
      while (websocketClass.toDispatch.length) {
        websocketClass.dispatch(websocketClass.toDispatch.shift());
      }
    }
  },
  toDispatch: [],
  dispatch: payload => {
    if (websocketClass.store) {
      websocketClass.store.dispatch(payload);
    } else {
      websocketClass.toDispatch.push(payload);
    }
  },
  attempts: 0,
  initialize: () => {
    websocketClass.attempts = websocketClass.attempts + 1;
    //websocketClass.log(`connecting at ws://${API_HOST}:${API_PORT}/, # ${websocketClass.attempts}`);
    this.websocket = new WebSocket(`ws://${API_HOST}:${API_PORT}/`);

    if (websocketClass.store) {
      websocketClass.get('websocket').onmessage = message(websocketClass.store);
    }
    this.websocket.onopen = open(websocketClass, () => {
      websocketClass.log('websocket connection opened');
      websocketClass.dispatch({
        type: WEBSOCKET_CONNECT,
        connected: true,
      });
      if (websocketClass.reconnect) {
        clearInterval(websocketClass.reconnect);
        websocketClass.reconnect = null;
      }
      websocketClass.attempts = 0;
    });
    //this.websocket.onerror = error(websocketClass);
    this.websocket.onclose = close(websocketClass, () => {
      if (websocketClass.attempts === 0) {
        websocketClass.log('websocket connection closed');
      }
      websocketClass.dispatch({
        type: WEBSOCKET_CONNECT,
        connected: false,
      });
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
  //console.log('configure websocket');
  websocketClass.get('websocket').onmessage = message(store);
  websocketClass.setStore(store);
}

export const attachLogger = websocketClass.attachLogger;
