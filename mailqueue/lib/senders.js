const db = require('../db');
const squel = require('squel');
const config = require('../config/mailgun');

function getSenders(req, res) {
  console.log('get senders!');
  const exclude = (req.query.exclude || '').split(',');

  const query = squel
                .select()
                .field('id')
                .field('sender')
                .from('senders')
                .where('id NOT IN ?', exclude)
                .limit(1);

  console.log(query.toString());
  db.query(query).then((rows) => {
    if ( rows && rows.length ) {
      res.json( rows[0] );
    } else {
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
      db.query(insert).then((result) => {
        if ( result && result.insertId ) {
          getSenders(req, res);
        } else {
          res.json({});
        }
      });
    }
  });
}

function getSenderID(req, res) {
  const sender = req.params.sender || '';
  const query = squel
                .select()
                .field('id')
                .from('senders')
                .where('sender=?', sender);

  console.log(query.toString());
  db.query(query).then((rows) => {
    if ( rows && rows.length ) {
      res.json({ id: rows[0].id });
    } else {
      res.json({ });
    }
  });
}

module.exports = getSenders;
module.exports.getSenderID = getSenderID;

