import {
  API_PORT,
  API_HOST,
} from '../../../../../config';

import {
  attemptConnection as _attemptConnection,
  updateStatus as _updateStatus,
} from '../actions';

import Network from '../../../Network';

import {
  dispatch,
  getStore,
} from './store';

import log from './log';

const updateStatus = (...rest) => {
  return dispatch(_updateStatus(...rest));
};
const attemptConnection = (...rest) => {
  return dispatch(_attemptConnection(...rest));
};

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
    attemptConnection();
    getStore().then(state => {
      log(`connecting at ws://${API_HOST}:${API_PORT}/, # ${state.attempts}`);
    });

    ws = new WebSocket(`ws://${API_HOST}:${API_PORT}/`);

    ws.onopen = () => {
      getStore().then(state => {
        const attempts = state.attempts;
        log(`websocket connection opened after ${attempts} attempts`);
      });
      resolve(ws);
    };

    ws.onclose = () => {
      updateStatus(false);
      getStore().then(state => {
        if (state.connected) {
          log('websocket has closed');
        }
      });

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
