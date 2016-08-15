/* There's a few ways connectivity can change:
 *
 * We boot up, and get a new connection
 * Phone loses connection, websocket should wait
 * Websocket server dies, websocket should ping
 * Phone gains connection, websocket should ping
 *
 */

import Network from '../../Network';

import {
  onMessage,
  sendMessage as origSendMessage,
} from './events';

import {
  setStore,
} from './utils/store';

import connect from './utils/connect';

let _sendMessage;

Network.onConnect(() => {
  connect().then(ws => {
    _sendMessage = origSendMessage(ws);
    ws.onmessage = onMessage;
  });
});

export const sendMessage = _sendMessage;
export const configureWebsocket = store => setStore(store);
