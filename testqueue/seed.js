const squel = require('squel');
//const now = squel.fval('NOW()');
const now = '2015-01-01 10:00:00';

module.exports = [
  {
    table: 'senders',
    rows: [
      { id: 1, sender: '+15551111111' },
      { id: 2, sender: '+15552222222' },
      { id: 3, sender: '+15553333333' },
      { id: 4, sender: '+15554444444' },
      { id: 5, sender: '+15555555555' }
    ]
  }
];
