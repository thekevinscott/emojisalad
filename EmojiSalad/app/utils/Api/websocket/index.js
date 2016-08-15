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
  sendMessage as _sendMessage,
} from './events';

import {
  setSendMessage,
} from './events/sendMessage';

import {
  setStore,
} from './utils/store';

import connect from './utils/connect';

Network.onConnect(() => {
  connect().then(ws => {
    setSendMessage(ws);
    ws.onmessage = onMessage;
  });
});

// this will be dispatched at some point in the future;
// if a websocket connection exists now, it will be
// sent now, or else it will be sent on connection.
export const sendMessage = _sendMessage;
export const configureWebsocket = store => setStore(store);
