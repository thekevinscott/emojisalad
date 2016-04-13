const db = require('../db');
const squel = require('squel');
const config = require('../config/mailgun');
const createSender = require('./createSender');

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
      createSender(exclude).then((sender_id) => {
        if (sender_id) {
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

