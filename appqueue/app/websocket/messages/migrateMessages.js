import selectLocalMessagesWithSMSID from './selectLocalMessagesWithSMSID';
import selectSMSMessages from './selectSMSMessages';
import insertSMSMessages from './insertSMSMessages';
import getUserGames from '../games/getUserGames';

export default function migrateMessages(user) {
  // first, select the messages that already exist in the
  // database with an sms id.
  return selectLocalMessagesWithSMSID(user.key).then(localMessages => {
    // second, select all messages from sms queue that
    // don't exist in the database.
    return selectSMSMessages(user.from, localMessages);
  }).then(smsMessages => {
    // third, retrieve all games for a user, so we can match
    // messages via game key
    return getUserGames(user.key).then(userGames => {
      // fourth, insert the messages from sms queue into app queue
      return insertSMSMessages(user.key, smsMessages, user.id, userGames);
    });
  }).catch(err => {
    console.error('error', err);
  });
}
