import pingBot from '../../../rest/pingBot';
import saveMessage from '../../messages/saveMessage';

export default function receive(ws, { userKey, gameKey, message }) {
  if (! userKey) {
    console.info('no user key');
    return new Promise((resolve, reject) => {
      reject('You must provide a user key');
    });
  } else if (! gameKey) {
    console.info('no game key');
    return new Promise((resolve, reject) => {
      reject('You must provide a game key');
    });
  } else if (! message) {
    console.info('no message');
    return new Promise((resolve, reject) => {
      reject('You must provide a message');
    });
  }

  // first, we save the message to the database.
  // second, alert the user the message went through.
  // third, we ping the bot.
  console.info('****** received outgoing message, save it', userKey, gameKey, message);
  return saveMessage('received', userKey, gameKey, message).then(response => {
    console.info('now ping bot async');
    pingBot();
    return response;
  });
}
