const squel = require('squel').useFlavour('mysql');
const db = require('db');
export default function saveDevice(user, payload) {
  console.info('save device for user');
  const userKey = user.key;
  const number = payload.phone;
  const device = payload.device;

  const fields = {
    user_key: userKey,
    number,
    device: JSON.stringify(device),
    created: squel.fval('NOW(3)'),
  };

  const query = squel
  .insert()
  .into('devices')
  .setFields(fields);
  return db.query(query);
}
