import db from 'db';
import Squel from 'squel';
const squel = Squel.useFlavour('mysql');

const updatePushId = (userKey, { pushId, pushToken }) => {
  console.info('update push id', userKey, pushId, pushToken);

  const query = squel
  .update('devices')
  .setFields({
    push_id: pushId,
    push_token: pushToken,
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

