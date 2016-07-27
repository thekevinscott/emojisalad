const squel = require('squel').useFlavour('mysql');
const db = require('db');
export default function insertSMSMessages(userId, messages) {
  return Promise.all([
    'received',
    'sent',
  ].map(table => {
    const rows = messages[table].map(message => {
      return {
        body: message.body,
        [table === 'received' ? '`from`' : '`to`']: userId,
        [table === 'received' ? '`to`' : '`from`']: table === 'received' ? message.to : message.from,
        data: message.data,
        createdAt: squel.fval(`FROM_UNIXTIME(${message.timestamp})`),
        //(new Date(message.createdAt)).getTime() / 1000,
        sms_id: message.id,
      };
    });

    if (rows.length) {
      const query = squel
      .insert()
      .into(table)
      .setFieldsRows(rows);

      //console.log('insert query', query.toString());

      return db.query(query).then(result => {
        //console.log('result', result);
        return result;
      });
    }

    console.info('no rows to insert for', table);
    return null;
  }));
}
