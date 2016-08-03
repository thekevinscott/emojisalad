import {
  getClient,
} from '../../connections';

import updateStatus from '../../messages/updateStatus';
import sendMessage from '../../sendMessage';
const RECEIVE_MESSAGE_FULFILLED = 'RECEIVE_MESSAGE_FULFILLED';

export default function send(message) {
  console.info('send message', message);
  const ws = getClient(message.userKey);
  if (ws) {
    console.info('ws exists, send it', message.key);
    return sendMessage(ws)({
      type: RECEIVE_MESSAGE_FULFILLED,
      data: message,
    }).then(() => {
      console.info('now update status delivered');
      return updateStatus(message.key, 'delivered');
    });
  }

  console.info('send a notification');
  return updateStatus(message.key, 'notified');
}
