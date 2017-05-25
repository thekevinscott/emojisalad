import startNewGame from '../../games/startNewGame';
import invitePlayers from '../../invites/invitePlayers';

export default function start(ws, { userKey, players }) {
  console.info('start!', userKey);
  return startNewGame(userKey).then(game => {
    console.info('game', game);
    console.info('now invite everybody', players);
    if (game.error) {
      throw new Error(game.error);
    }

    return invitePlayers(game.players[0].key, game.key, players).then(invites => {
      //console.log('result', res);
      return {
        ...game,
        invites,
      };
    });
  }).then(game => {
    console.info('all users invited');
    return game;
  }).catch(err => {
    console.info('some error', err);
    return err;
  });
};
