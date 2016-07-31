const squel = require('squel').useFlavour('mysql');
import db from 'db';
import getUUID from '../../../utils/getUUID';

function getPromise() {
  return new Promise(resolve => resolve());
}

function updateKey(table, smsId, attempts = 0) {
  if (attempts > 5) {
    throw new Error(`too many attempts trying to generate random ID with ${table} and SMS id ${smsId}`);
  }
  const key = getUUID();

  const updateQuery = squel
  .update()
  .table(table)
  .setFields({
    '`key`': key,
  })
  .where('sms_id=?', smsId);

  return db.query(updateQuery).then(dbResult => {
    if (dbResult.affectedRows === 0) {
      console.info('uh oh, try again!', table, smsId);
      return updateKey(table, smsId, attempts + 1);
    }
  });
}

function insertAllQueries(table, queries) {
  return queries.reduce((promise, { query, row }) => {
    return promise.then(() => {
      //console.log('executing', query.toString());
      return db.query(query);
    }).then(result => {
      //console.log('result back for row', row.sms_id, result);
      if (!result || !result.affectedRows) {
        console.log('error inserting', query.toString());
        throw new Error('Error inserting row');
      }
      return result;
    }).then(result => {
      //console.log('executing update key for', row.sms_id);
      return updateKey(table, row.sms_id).then(() => {
        return result;
      });
    });
  }, getPromise());
}

function getSenderForGames(games, userKey) {
  return games.reduce((obj, game) => {
    const matchingPlayer = game.players.filter(player => {
      return player.user_key === userKey;
    }).pop();

    //console.log('game', game);

    return {
      ...obj,
      [matchingPlayer.to]: game.key,
    };
  }, {});
}

export default function insertSMSMessages(userKey, messages, userId, gamesArray) {
  console.info('time to insert sms messages');
  return Promise.all([
    'received',
    'sent',
  ].map(table => {
    console.info('insert for table', table);
    const games = getSenderForGames(gamesArray, userKey);
    console.info('got sender for games', games);
    const rows = messages[table].map(message => {
      console.info('the message', message);
      const key = table === 'received' ? 'to' : 'from';
      const messageKey = message[key];
      //console.log('message key', key, messageKey, games);
      const gameKey = games[messageKey];
      //console.log('game key', gameKey);
      return {
        body: message.body,
        [table === 'received' ? 'from' : 'to']: userId,
        [table === 'received' ? 'to' : 'from']: table === 'received' ? message.to : message.from,
        data: message.data,
        timestamp: message.timestamp,
        sms_id: message.id,
        gameKey,
      };
    });

    if (rows.length) {
      console.info('we have messages to insert');
      const queries = rows.map(row => {
        return {
          row,
          query: squel
          .insert()
          .into(table)
          .setFields({
            body: row.body,
            '`from`': row.from,
            '`to`': row.to,
            //data: row.data,
            created: squel.fval(`FROM_UNIXTIME(${row.timestamp})`),
            sms_id: row.sms_id,
            user_key: userKey,
            game_key: row.gameKey,
          }),
        };
      });

      console.info(`inserting ${rows.length} rows in ${table}`);
      //console.info('insert query', query.toString());
      return insertAllQueries(table, queries).then(result => {
        console.info('result of insert', result);
        return rows.reduce((promise, row) => {
          return promise.then(() => {
            return updateKey(table, row.sms_id);
          });
        }, getPromise()).then(() => {
          return null;
        });
      });
    }

    console.info('no rows to insert for', table);
    return null;
  }));
}
