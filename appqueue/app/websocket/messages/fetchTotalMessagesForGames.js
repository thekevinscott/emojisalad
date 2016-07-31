const squel = require('squel').useFlavour('mysql');
import db from 'db';

import {
  getWhereParameters,
} from './fetchMessagesForGames';

function getFields(table) {
  return squel
  .select()
  .field('`key`')
  .field('user_key')
  .field('game_key')
  .from(table);
}

function getTotalQuery(where) {
  const query = squel
  .select()
  .field('count(1) as total')
  .from(
    getFields('sent')
    .union(
      getFields('received')
    ), 't'
  )
  .group('game_key');

  return Object.keys(where).reduce((q, key) => {
    return q.where(key, where[key]);
  }, query);
}
function fetchTotals(where) {
  const query = getTotalQuery(where);
  //console.log('the query', query.toString());
  return db.query(query);
}

export default function fetchTotalMessagesForGames(userKey, gameKeys) {
  return Promise.all(gameKeys.map(gameKey => {
    return fetchTotals(getWhereParameters(
      userKey,
      gameKey
    )).then(totalMessages => ({
      [gameKey]: ((totalMessages || [])[0] || {}).total || 0,
    }));
  })).then(totals => {
    return totals.reduce((obj, gameTotals) => ({
      ...obj,
      ...gameTotals,
    }), {});
  });
}
