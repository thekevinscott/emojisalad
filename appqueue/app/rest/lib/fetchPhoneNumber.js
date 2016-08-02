const squel = require('squel').useFlavour('mysql');
import db from 'db';

export default function fetchPhoneNumber(userKey) {
  const query = squel
  .select()
  .field('number')
  .from('devices')
  .where('user_key=?', userKey);
  return db.query(query).then(rows => {
    if (rows.length) {
      return rows[0].number || null;
    }

    return null;
  });
}
