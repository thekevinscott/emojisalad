import pingBot from '../../../rest/pingBot';
import saveMessage from '../../messages/saveMessage';

export default function sendMessage(ws, { userKey, gameKey, message }) {
  if (! userKey) {
    return new Promise((resolve, reject) => {
      reject('You must provide a user key');
    });
  } else if (! gameKey) {
    return new Promise((resolve, reject) => {
      reject('You must provide a game key');
    });
  } else if (! message) {
    return new Promise((resolve, reject) => {
      reject('You must provide a message');
    });
  }

  // first, we save the message to the database.
  // second, alert the user the message went through.
  // third, we ping the bot.
  return saveMessage('received', userKey, gameKey, message).then(response => {
    pingBot();
    return response;
  });
}
