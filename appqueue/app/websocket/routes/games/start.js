import startNewGame from '../../games/startNewGame';
import sendUserInviteMessage from '../../invites/sendUserInviteMessage';

export default function start(ws, { userKey, phones }) {
  return startNewGame(userKey).then(game => {
    if (game.error) {
      throw new Error(game.error);
    }

    console.info('now invite everybody');

    return Promise.all(phones.map(phone => {
      console.info('inviting this phone', phone);
      return sendUserInviteMessage(userKey, game.key, phone).catch(err => {
        console.info('an error', err);
      });
    }));
  }).then(resp => {
    console.info('all users invited');
  }).catch(err => {
    console.info('some error', err);
    return err;
  });
};
