const squel = require('squel').useFlavour('mysql');
const db = require('db');
import setKey from 'setKey';

const TABLES = [
  'categories',
  'clues',
  'emojis',
  'games',
  'guesses',
  'invites',
  'players',
  'rounds',
  'users',
];

function getPromise() {
  return new Promise(resolve => resolve());
}

const promise = getPromise();
TABLES.map(table => {
  promise.then(() => {
    const query = squel
    .select()
    .from(table)
    .where('`key` IS NULL');

    return db.query(query).then(rows => {
      console.log('missing keys', table, rows.length);
      if (rows.length > 0) {
        return rows.map(row => {
          return setKey(table, row);
        });
      }
    });
  });
});
