import selectLocalMessagesWithSMSID from './selectLocalMessagesWithSMSID';
import selectSMSMessages from './selectSMSMessages';
import insertSMSMessages from './insertSMSMessages';

export default function migrateMessages(user) {
  // first, select the messages that already exist in the
  // database with an sms id.
  return selectLocalMessagesWithSMSID(user.id).then(localMessages => {
    //console.log('sms ids that exist locally', localMessages.sent, localMessages.received);
    // second, select all messages from sms queue that
    // don't exist in the database.
    return selectSMSMessages(user.from, localMessages);
  }).then(smsMessages => {
    //console.log('collected messages', 'sent', smsMessages.sent.map(msg => msg.id), 'received', smsMessages.received.map(msg => msg.id));
    // third, insert the messages from sms queue into app queue
    return insertSMSMessages(user.id, smsMessages);
  }).then(result => {
    //console.log('all inserted');
    return result;
  }).catch(err => {
    console.error('error', err);
  });
}
