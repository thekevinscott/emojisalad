import db from 'db';
import Squel from 'squel';
const squel = Squel.useFlavour('mysql');

const updatePushId = (userKey, { pushId }) => {
  console.info('update push id', userKey, pushId);

  const query = squel
  .update('devices')
  .set({
    push_id: pushId,
  })
  .where('user_key', userKey);
  console.info('update push id', query.toString());
  return db.query(query).then(() => {
    return {};
  }).then(response => {
    console.log('update push id complete');
    return response;
  });
};

export default updatePushId;

