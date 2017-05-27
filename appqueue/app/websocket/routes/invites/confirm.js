import receive from '../messages/receive';

export default function confirmInvite(ws, { userKey, gameKey }) {
  console.info('confirm invite', userKey, gameKey);

  const message = {
    body: 'Yes',
  };

  const payload = {
    userKey,
    gameKey,
    message,
  };

  return receive({}, payload);
};
