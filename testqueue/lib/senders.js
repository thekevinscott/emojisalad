const db = require('../db');
const squel = require('squel');

function getSenders(req, res) {
  var query = squel
  .select()
  .field('id')
  .field('sender')
  .from('senders')
  .limit(1);

  console.log(req.body);
  console.log(req.params);

  if (req.query.exclude) {
    const exclude = (req.query.exclude || '').split(',');
    query = query.where('id NOT IN ?', exclude);
  }

  if (req.query.sender_id) {
    query = query.where('id=?', req.query.sender_id);
  }
  console.log(req.query);
  console.log(query.toString());

  db.query(query).then((rows) => {
    if (rows && rows.length) {
      res.json(rows[0]);
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
    if (rows && rows.length) {
      res.json({ id: rows[0].id });
    } else {
      res.json({ });
    }
  });
}

module.exports = getSenders;
module.exports.getSenderID = getSenderID;
