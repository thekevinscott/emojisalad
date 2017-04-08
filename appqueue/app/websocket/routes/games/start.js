import startNewGame from '../../games/startNewGame';
import sendUserInviteMessage from '../../invites/sendUserInviteMessage';

export default function start(ws, { userKey, phones }) {
  console.info('start new game', userKey, phones);

  return startSingleNewGame(userKey).then(game => {
    console.log('game', game);
    console.log('now invite everybody');

    return Promise.all(phones.map(phone => sendUserInviteMessage(userKey, game.key, phone)));
  }).then(resp => {
    console.log('all users invited');
  });
};
