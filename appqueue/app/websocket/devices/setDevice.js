import db from 'db';
import Squel from 'squel';
const squel = Squel.useFlavour('mysql');

const getFields = (userKey, fields = {}) => {
  return {
    ...fields,
    user_key: userKey,
  };
};

const getQuery = (userKey, payload) => {
  //console.log('user key', userKey, payload);
  const fields = getFields(userKey, payload);

  let query = squel
  .insert()
  .into('devices')
  .setFields({
    ...fields,
    created: squel.fval('NOW(3)'),
  });

  Object.keys(fields).filter(key => [
    'created',
  ].indexOf(key) === -1).forEach(key => {
    query = query.onDupUpdate(key, fields[key]);
  });

  return query;
};

const setDevice = (userKey, fields) => {
  console.log('setDevice begin');
  const query = getQuery(userKey, fields);

  console.info('set device query', query.toString());
  return db.query(query).then(() => {
    return {};
  }).then(response => {
    console.log('setDevice complete');
    return response;
  });
};

export default setDevice;
