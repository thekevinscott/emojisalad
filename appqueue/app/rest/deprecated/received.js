'use strict';
const Promise = require('bluebird');
const moment = require('moment');
const squel = require('squel').useFlavour('mysql');

const db = require('db');
module.exports = (req, res) => {
  //console.info('\n================queue received=================\n');
  //console.info('queue received, query', req.query);

  const max_limit = 100;
  let limit = req.query.limit || max_limit;
  if ( limit > max_limit ) {
    limit = max_limit;
  }

  const offset = req.query.offset || 0;
  const date = req.query.date;
  const id = req.query.id;
  const from = req.query.from;
  const to = req.query.to;


  let query = squel
  .select(
    { autoQuoteTableNames: true, autoQuoteFieldNames: true }
  )
  .field('received.id')
  .field('body')
  .field('from')
  .field('s.sender')
  .field('to')
  .field('createdAt', 'timestamp')
  //.field(squel.fval('UNIX_TIMESTAMP(createdAt)', 'timestamp'))
  .from('received')
  .left_join('senders','s','s.id=received.`to`')
  .limit(limit)
  .offset(offset);

  /*
     if ( date ) {
  //query = query.where(
  options.where = {
createdAt: {
$gt: sequelize.fn('FROM_UNIXTIME', date)
}
}
}
*/

  if ( id ) {
    query = query.where('received.id>?', id);
  }

  if ( from ) {
    query = query.where('`from`=?', from);
  }

  if ( to ) {
    query = query.where('`to`=?', to);
  }

  return db.query(query).then((rows) => {
    return res.json(rows || []);
  });
};



