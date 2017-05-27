import receive from '../messages/receive';

export default function cancelInvite(ws, { userKey, gameKey }) {
  console.info('cancel invite', userKey, gameKey);

  const message = {
    body: 'No',
  };

  const payload = {
    userKey,
    gameKey,
    message,
  };

  return receive({}, payload);
};

