import phoneFormatter from 'node-phone-formatter';
import db from '../db';
import squel from 'squel';

export default function jungle(req, res) {
  const query = squel
  .select()
  .from('jungle');

  return db.query(query).then((rows) => {
    res.json(rows);
  });
}

