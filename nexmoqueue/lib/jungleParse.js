import phoneFormatter from 'phone-formatter';
import db from '../db';
import squel from 'squel';
const websocket = require('./websocket');

let callback = () => {};

const timer = setInterval(() => {
  const io = websocket();
  if (io) {
    console.log('io now exists');
    clearInterval(timer);
    io.on('connection', (socket) => {
      console.log('got connection');
      const callback = (number, message) => {
        console.log('broadcast', number, message);
        socket.broadcast.emit('message', {
          number,
          message,
        });
      };
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
    callback(number, message);
    return rows;
  });
}
