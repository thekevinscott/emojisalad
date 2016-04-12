const squel = require('squel');
//const now = squel.fval('NOW()');
const now = '2015-01-01 10:00:00';

const senders = require('./config/numbers');

module.exports = [
  {
    table: 'senders',
    rows: senders.map((sender, i) => {
      return { id: i + 1, sender };
    })
  }
];
