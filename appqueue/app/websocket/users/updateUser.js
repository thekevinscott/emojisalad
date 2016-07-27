// update protocol on user
// copy messages over
import updateProtocolForUser from './updateProtocolForUser';
import migrateMessages from '../messages/migrateMessages';
import sendMessage from '../sendMessage';
export default function updateUser(ws, user) {
  return Promise.all([
    updateProtocolForUser(user),
    migrateMessages(user),
  ]).then(() => {
    sendMessage(ws)({
      type: 'MIGRATE_USER_FULFILLED',
      data: {
      },
    });
  });
}
