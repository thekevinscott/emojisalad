import selectLocalMessagesWithSMSID from './selectLocalMessagesWithSMSID';
import selectSMSMessages from './selectSMSMessages';
import insertSMSMessages from './insertSMSMessages';

export default function migrateMessages(user) {
  // first, select the messages that already exist in the
  // database with an sms id.
  return selectLocalMessagesWithSMSID(user.id).then(localMessages => {
    // second, select all messages from sms queue that
    // don't exist in the database.
    return selectSMSMessages(user.from, localMessages);
  }).then(smsMessages => {
    // third, insert the messages from sms queue into app queue
    return insertSMSMessages(user.id, smsMessages);
  }).then(result => {
    return result;
  }).catch(err => {
    console.error('error', err);
  });
}
