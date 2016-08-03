const squel = require('squel').useFlavour('mysql');
import db from 'db';
import getPlayerWhereQuery from './lib/getPlayerWhereQuery';
//const Promise = require('bluebird');
//const moment = require('moment');
//const squel = require('squel').useFlavour('mysql');

import {
  translateOutgoingMessage,
} from './lib/translate';

export default function (req, res) {
  //console.info('\n================queue received=================\n');
  //console.info('queue received, query', req.query);

  const maxLimit = 100;
  let limit = req.query.limit || maxLimit;
  if (limit > maxLimit) {
    limit = maxLimit;
  }

  const offset = req.query.offset || 0;
  //const date = req.query.date;
  const id = req.query.id;
  const from = req.query.from;
  const to = req.query.to;
  const players = req.query.players;
  //const order = (req.query.order === 'DESC') ? false : true;
  const order = req.query.order !== 'DESC';

  let query = squel
  .select()
  .field('id')
  .field('received.id')
  .field('body')
  .field('user_key')
  //.field('"fooey"', 'sender')
  .field('game_key')
  .field('created', 'timestamp')
  .from('received')
  .where('sms_id IS NULL')
  //.left_join('senders','s','s.id=received.`to`')
  .order('id', order)
  .limit(limit)
  .offset(offset);

  if (id) {
    query = query.where('received.id>?', id);
  }

  if (from) {
    query = query.where('`user_key`=?', from);
  }

  if (to) {
    query = query.where('`game_key`=?', to);
  }

  if (players) {
    query = query.where(`${getPlayerWhereQuery(players, false)}`);
  }

  //console.log(query.toString());
  return db.query(query).then((rows) => {
    return Promise.all((rows || []).map(row => {
      return translateOutgoingMessage(row);
    }));
  }).then(rows => {
    if (rows.length) {
      console.info('new received messages', rows);
    }
    return res.json(rows);
  });
}
