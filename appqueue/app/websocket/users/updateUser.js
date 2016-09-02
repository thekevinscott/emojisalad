// update protocol on user
// copy messages over
import updateProtocolForUser from './updateProtocolForUser';
import migrateMessages from '../messages/migrateMessages';
import sendMessage from '../sendMessage';
import setDevice from '../devices/setDevice';
export default function updateUser(ws, user, payload) {
  console.info('update user route', payload);
  return Promise.all([
    updateProtocolForUser(user),
    migrateMessages(user),
    setDevice(user.key, {
      //device_info: JSON.stringify(payload.device),
      number: payload.phone,
    }),
  ]).then(() => {
    console.info('user updated successfully');
    sendMessage(ws)({
      type: 'MIGRATE_USER_FULFILLED',
      data: {
      },
    });
  });
}
