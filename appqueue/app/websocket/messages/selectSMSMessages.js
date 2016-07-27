//import fetchFromService from '../lib/fetchFromService';
const squel = require('squel').useFlavour('mysql');
const db = require('db');
const sms = db.sms;

export default function selectSMSMessages(phone, messageIds) {
  return Promise.all([
    'received',
    'sent',
  ].map(table => {
    const key = table === 'received' ? 'from' : 'to';

    const query = squel
    .select()
    .field('*')
    .field('UNIX_TIMESTAMP(createdAt) as timestamp')
    .from(table)
    .where('id NOT IN (?)', messageIds[table].join('\',\''))
    .where(`\`${key}\`=?`, phone);
    //console.log(query.toString());
    return sms.query(query.toString());
  })).then(messages => {
    //console.log('messages back from query', messages);
    return {
      received: messages[0],
      sent: messages[1],
    };
  });
}
