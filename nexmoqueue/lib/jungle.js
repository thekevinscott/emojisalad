import phoneFormatter from 'phone-formatter';
import db from '../db';
import squel from 'squel';

module.exports = function jungle(req, res) {
  const query = squel
  .select()
  .from('jungle');

  return db.query(query).then((rows) => {
    res.json(rows);
  });
}
