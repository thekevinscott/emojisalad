
import sendMessage from '../routes/messages/receive';
import fetchFromService from '../../../utils/fetchFromService';

export default function sendUserInviteMessage(userKey, gameKey, phone) {
  if (!userKey) {
    throw new Error('You must provide a user key');
  }
  if (!phone) {
    throw new Error('You must provide a phone');
  }

  const message = `Invite ${phone}`;

  sendMessage(_, {
    userKey,
    gameKey,
    message,
  });
}
