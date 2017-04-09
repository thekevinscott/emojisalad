import startNewGame from '../../games/startNewGame';
import sendUserInviteMessage from '../../invites/sendUserInviteMessage';

export default function invite(ws, { userKey, gameKey, phones }) {
  console.info('invite to game', gameKey, 'from user', userKey);
  return Promise.all(phones.map(phone => {
    console.info('inviting this phone', phone);
    return sendUserInviteMessage(userKey, gameKey, phone).catch(err => {
      console.info('an error', err);
    });
  })).then(() => {
    console.info('all users invited');
    return {};
  }).catch(err => {
    console.info('some error', err);
    return err;
  });
};
