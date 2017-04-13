import leaveGame from '../../games/leaveGame';

export default function leave(ws, { userKey, gameKey }) {
  console.info('game', gameKey);
  return leaveGame(userKey, gameKey).then(() => {
    console.info('game left', userKey, gameKey);
    return {};
  }).catch(err => {
    console.info('some error', err);
    return err;
  });
};

