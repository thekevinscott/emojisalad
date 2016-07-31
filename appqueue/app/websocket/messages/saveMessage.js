const squel = require('squel').useFlavour('mysql');
import db from 'db';
import getUUID from '../../../utils/getUUID';

export default function saveMessage(table, userKey, gameKey, message, attempts = 0) {
  if (attempts > 5) {
    throw new Error(`too many attempts trying to generate random ID with ${table} and message ${message.body}`);
  }
  const key = getUUID();

  const query = squel
  .insert()
  .into(table)
  .setFields({
    body: message.body,
    created: squel.fval('NOW(3)'),
    user_key: userKey,
    game_key: gameKey,
    '`key`': key,
  });

  return db.query(query).then(result => {
    if (!result || !result.insertId) {
      console.log('Error inserting message', query.toString());
      return saveMessage(table, userKey, gameKey, message, attempts + 1);
    }
    return {
      key,
      body: message.body,
      userKey,
      gameKey,
      timestamp: (new Date()).getTime() / 1000 + (365*24*60*60) ,
      type: table,
    };
  });
}
