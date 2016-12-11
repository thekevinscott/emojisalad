const squel = require('squel').useFlavour('mysql');
import db from 'db';

const LIMIT = 20;

function getFields(table) {
  return squel
  .select()
  .field('body')
  .field('message_key')
  .field(`'${table}'`, 'type')
  .field('UNIX_TIMESTAMP(created)', 'timestamp')
  .field('`key`')
  .field('user_key')
  .field('game_key')
  .from(table);
}

function getQuery(where, limit) {
  if (!limit || limit >= LIMIT) {
    limit = LIMIT;
  }
  const query = squel
  .select()
  .from(
    getFields('sent')
    .union(
      getFields('received')
    ), 't'
  )
  .order('timestamp', false)
  .limit(limit);

  return Object.keys(where).reduce((q, key) => {
    return q.where(key, where[key]);
  }, query);
}

export default function fetchMessagesForGame(where = {}, limit) {
  const query = getQuery(where, limit);
  console.log('the query', query.toString());
  return db.query(query);
}

