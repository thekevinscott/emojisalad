const squel = require('squel').useFlavour('mysql');
import db from 'db';

function getOriginalQuery() {
  return squel
  .select()
  .from('devices')
  .order('created', false);
}

function getQueryFields(originalQuery, fields) {
  return fields.reduce((query, field) => {
    return query.field(field);
  }, originalQuery);
}

function getQueryWhere(originalQuery, where) {
  return Object.keys(where).reduce((query, key) => {
    return query.where(key, where[key]);
  }, originalQuery);
}

function getQuery(query, fields, where) {
  return getQueryWhere(
    getQueryFields(query, fields),
    where
  );
}

export default function fetchFromDevice(fields, where) {
  const query = getQuery(
    getOriginalQuery(),
    fields,
    where
  );

  return db.query(query).then(rows => {
    if (rows.length) {
      return rows[0] || null;
    }

    return null;
  });
}
