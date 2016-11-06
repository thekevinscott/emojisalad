const db = require('../db');
const squel = require('squel');

function getSenders(req, res) {
  const exclude = (req.query.exclude || '').split(',');

  const query = squel
                .select()
                .field('id')
                .field('sender')
                .from('senders')
                .where('id NOT IN ?', exclude)
                .limit(1);

  db.query(query).then((rows) => {
    if ( rows && rows.length ) {
      res.json( rows[0] );
    } else {
      res.json({ });
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
