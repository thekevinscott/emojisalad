import startNewGame from '../../games/startNewGame';
import sendUserInviteMessage from '../../invites/sendUserInviteMessage';

export default function start(ws, { userKey, phones }) {
  console.log('****** start!');
  return startNewGame(userKey).then(game => {
    console.log('game back', game);
    if (game.error) {
      throw new Error(game.error);
    }

    console.info('game', game);
    console.info('now invite everybody');

    return Promise.all(phones.map(phone => sendUserInviteMessage(userKey, game.key, phone)));
  }).then(resp => {
    console.info('all users invited');
  }).error(err => {
    console.info('some error', err);
  });
};
