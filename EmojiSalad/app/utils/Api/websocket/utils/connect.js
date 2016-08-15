import {
  API_PORT,
  API_HOST,
} from '../../../../../config';

import {
  attemptConnection,
  updateStatus,
} from '../actions';

import Network from '../../../Network';

import {
  dispatch,
  getStore,
} from './store';

import log from './log';

let ws;
let reconnecter;

const clearReconnecter = () => {
  if (reconnecter) {
    clearInterval(reconnecter);
    reconnecter = null;
  }
};

const setReconnector = callback => {
  clearReconnecter(reconnecter);
  reconnecter = setTimeout(callback, 1000);
};

const connect = () => {
  return new Promise(resolve => {
    dispatch(attemptConnection());
    log(`connecting at ws://${API_HOST}:${API_PORT}/, # ${getStore().attempts}`);

    ws = new WebSocket(`ws://${API_HOST}:${API_PORT}/`);

    ws.onopen = () => {
      updateStatus(true);
      log('websocket connection opened');
      resolve(ws);
    };

    ws.onclose = () => {
      updateStatus(false);
      if (getStore().connected) {
        log('websocket has closed');
      }

      // If there is a connection, that means the websocket fell
      // over. Try and reconnect.
      //
      // If there is no connection, we'll catch it explicitly
      // in the index file when we reconnect.
      if (Network.hasConnection()) {
        setReconnector(() => {
          connect();
        });
      }
    };
  });
};

export default connect;
