const squel = require('squel').useFlavour('mysql');
const db = require('db');

export default function selectLocalMessagesWithSMSID(userKey) {
  return Promise.all([
    'received',
    'sent',
  ].map(table => {
    //const key = table === 'received' ? 'from' : 'to';

    const query = squel
    .select()
    .field('sms_id')
    .from(table)
    .where('sms_id IS NOT NULL')
    //.where(`\`${key}\`=?`, userId);
    .where('user_key', userKey);
    //console.log(query.toString());
    return db.query(query).then(messages => {
      return messages.map(message => {
        return message.sms_id;
      });
    });
  })).then(messages => {
    return {
      received: messages[0],
      sent: messages[1],
    };
  });
}
