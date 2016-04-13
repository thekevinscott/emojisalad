const db = require('../db');
const squel = require('squel');
const config = require('../config/mailgun');
module.exports = (exclude) => {
  console.log('add a sender!', config);
  const game_name = `game${exclude.length + 1}`;
  const sender = `${game_name}@${config.domain}`;
  const insert = squel
                 .insert()
                 .into('senders')
                 .setFields({
                   sender
                 });
  console.log(insert.toString());
  return db.query(insert).then((result) => {
    if ( result && result.insertId ) {
      return result.insertId;
    } else {
      return null;
    }
  });
};
