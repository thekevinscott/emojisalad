import selectLocalMessagesWithSMSID from './selectLocalMessagesWithSMSID';
import selectSMSMessages from './selectSMSMessages';
import insertSMSMessages from './insertSMSMessages';
import getUserGames from '../games/getUserGames';

export default function migrateMessages(user) {
  console.info('migrate messages for user');
  // first, select the messages that already exist in the
  // database with an sms id.
  return selectLocalMessagesWithSMSID(user.key).then(localMessages => {
    console.info('got local messages, received: ', localMessages.received.length, 'sent', localMessages.sent.length);
    // second, select all messages from sms queue that
    // don't exist in the database.
    return selectSMSMessages(user.key, localMessages);
  }).then(smsMessages => {
    console.info('got sms messages, received', smsMessages.received.length, 'sent', smsMessages.sent.length);
    // third, retrieve all games for a user, so we can match
    // messages via game key
    return getUserGames(user.key).then(userGames => {
      console.info('got games for user', userGames.length);
      // fourth, insert the messages from sms queue into app queue
      return insertSMSMessages(user.key, smsMessages, user.id, userGames);
    });
  }).then(response => {
    console.info('migrate messages complete');
    return response;
  }).catch(err => {
    console.error('error', err);
  });
}
