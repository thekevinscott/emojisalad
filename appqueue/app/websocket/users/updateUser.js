// update protocol on user
// copy messages over
import updateProtocolForUser from './updateProtocolForUser';
import migrateMessages from '../messages/migrateMessages';
import sendMessage from '../sendMessage';
import saveDevice from './saveDevice';
export default function updateUser(ws, user, payload) {
  console.info('update user route');
  return Promise.all([
    updateProtocolForUser(user),
    migrateMessages(user),
    saveDevice(user, payload),
  ]).then(() => {
    console.info('user updated successfully');
    sendMessage(ws)({
      type: 'MIGRATE_USER_FULFILLED',
      data: {
      },
    });
  });
}
