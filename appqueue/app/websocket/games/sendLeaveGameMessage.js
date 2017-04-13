import receive from '../routes/messages/receive';
import fetchFromService from '../../../utils/fetchFromService';

export default function sendLeaveGameMessage(userKey, gameKey) {
  console.log('send leave game message');
  if (!userKey) {
    throw new Error('You must provide a user key');
  }
  if (!gameKey) {
    throw new Error('You must provide a game key');
  }

  const message = {
    body: `LEAVE`,
  };

  const payload = {
    userKey,
    gameKey,
    message,
  };

  return receive({}, payload);
}

