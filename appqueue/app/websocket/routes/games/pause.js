import pauseGame from '../../games/pauseGame';

export default function pause(ws, { userKey, gameKey }) {
  console.info('game', gameKey);
  return pauseGame(userKey, gameKey).then(() => {
    console.info('game paused', userKey, gameKey);
    return {};
  }).catch(err => {
    console.info('some error', err);
    return err;
  });
};

