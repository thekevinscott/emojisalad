const squel = require('squel').useFlavour('mysql');
import db from 'db';

const LIMIT = 20;

function getFields(table) {
  return squel
  .select()
  .field('body')
  .field(`'${table}'`, 'type')
  .field('UNIX_TIMESTAMP(created)', 'timestamp')
  .field('`key`')
  .field('user_key')
  .field('game_key')
  .from(table);
}

function getQuery(where) {
  const query = squel
  .select()
  .from(
    getFields('sent')
    .union(
      getFields('received')
    ), 't'
  )
  .order('timestamp', false)
  .limit(LIMIT);

  return Object.keys(where).reduce((q, key) => {
    return q.where(key, where[key]);
  }, query);
}

export default function fetchMessagesForGame(where = {}) {
  const query = getQuery(where);
  console.log('the query', query.toString());
  return db.query(query);
}

