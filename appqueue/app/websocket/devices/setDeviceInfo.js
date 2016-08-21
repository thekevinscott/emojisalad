import db from 'db';
import Squel from 'squel';
const squel = Squel.useFlavour('mysql');

const getFields = (userKey, info, phone) => {
  const fields = {
    user_key: userKey,
    device: JSON.stringify(info),
    created: squel.fval('NOW(3)'),
  };

  if (phone) {
    return {
      ...fields,
      phone,
    };
  }

  return fields;
};

const getQuery = fields => {
  let query = squel
  .insert()
  .into('devices')
  .setFields(fields);

  Object.keys(fields).filter(key => [
    'created',
  ].indexOf(key) === -1).forEach(key => {
    query = query.onDupUpdate(key, fields[key]);
  });

  return query;
};

const setDeviceInfo = (userKey, info, phone) => {
  //console.log('set the device info', info, userKey);

  const fields = getFields(userKey, info, phone);

  const query = getQuery(fields);

  console.log(query.toString());
  return db.query(query).then(() => {
    return {};
  });
};

export default setDeviceInfo;
