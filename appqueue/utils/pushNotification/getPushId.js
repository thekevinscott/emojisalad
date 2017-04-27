import db from 'db';
import Squel from 'squel';
const squel = Squel.useFlavour('mysql');

const getPushId = (userKey) => {
  const query = squel
  .select('push_id')
  .from('devices')
  .where('user_key = ?', userKey);

  return db.query(query).then((rows) => {
    if (rows && rows.length) {
      return rows[0].push_id;
    }

    throw new Error(`No push id found for: ${userKey}`);
  }).then(response => {
    console.log('update push id complete');
    return response;
  });
};

export default getPushId;
