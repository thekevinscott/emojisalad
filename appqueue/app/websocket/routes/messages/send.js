import {
  getClient,
} from '../../connections';

import pushNotification from '../../../../utils/pushNotification';

import updateStatus from '../../messages/updateStatus';
import sendMessage from '../../sendMessage';

const KEVIN = '1440652f 67d58da6 edd9d862 cb1e2075 d12f5ed3 c194513e 731c110f 86d899eb';
//const ARI = '226f514c 514a38da b81047f1 1ae4a3fc b9a6d480 0bee611b 6d355a09 8319e549';

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


  pushNotification(KEVIN, message.body, {
    badge: 3,
  });
  console.info('send a notification', message);
  return updateStatus(message.key, 'notified');
}
