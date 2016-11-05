import phoneFormatter from 'phone-formatter';
import db from '../db';
import squel from 'squel';

module.exports = function jungleParse({
  text: message,
  msisdn,
}) {
  const number = phoneFormatter.format(msisdn, "(NNN) NNN-NNNN");
  console.info('incoming params for da jungle', message, number);

  const query = squel
  .insert({
    autoEscapeFieldNames: true,
  })
  .into('jungle_messages')
  .setFields({
    number,
    message,
    created: squel.fval('NOW(3)'),
  });

  console.log(query.toString());
  return db.query(query).then((rows) => {
    return rows;
  });
}
