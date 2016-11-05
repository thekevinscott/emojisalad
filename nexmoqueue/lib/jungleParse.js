import phoneFormatter from 'phone-formatter';
import db from '../db';
import squel from 'squel';
const websocket = require('./websocket');

let callback = () => {};

let io;

const timer = setInterval(() => {
  io = websocket();
  if (io) {
    console.log('io now exists');
    clearInterval(timer);
    io.on('connection', (socket) => {
      console.log('got connection');
    });

  }
}, 50);


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
    console.log('broadcast', number, message);
    if (io) {
      io.emit('message', {
        id: rows.insertId,
        number,
        message,
        created: new Date(),
      });
    }
    return rows;
  });
}
