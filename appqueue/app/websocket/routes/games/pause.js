import sendPauseGameMessage from '../../games/sendPauseGameMessage';

export default function pause(ws, { userKey, gameKey }) {
  console.info('game', gameKey);
  return sendPauseGameMessage(userKey, gameKey).then(() => {
    console.info('game paused', userKey, gameKey);
    return {};
  }).catch(err => {
    console.info('some error', err);
    return err;
  });
};

