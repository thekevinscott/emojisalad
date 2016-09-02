// update protocol on user
// copy messages over
import updateProtocolForUser from './updateProtocolForUser';
import migrateMessages from '../messages/migrateMessages';
import sendMessage from '../sendMessage';
export default function updateUser(ws, user, payload) {
  console.info('update user route', payload);
  return Promise.all([
    updateProtocolForUser(user),
    migrateMessages(user),
  ]).then(() => {
    console.info('user updated successfully');
    sendMessage(ws)({
      type: 'MIGRATE_USER_FULFILLED',
      data: {
      },
    });
  });
}
