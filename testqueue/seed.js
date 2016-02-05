const squel = require('squel');
//const now = squel.fval('NOW()');
const now = '2015-01-01 10:00:00';

module.exports = [
  {
    table: 'received',
    rows: [
      { '`to`': '+15551111111', '`from`': ''+Math.random(), body: ''+Math.random(), data: '', createdAt: now },
      { '`to`': '+15552222222', '`from`': ''+Math.random(), body: ''+Math.random(), data: '', createdAt: now },
      { '`to`': '+15553333333', '`from`': ''+Math.random(), body: ''+Math.random(), data: '', createdAt: now },
      { '`to`': '+15554444444', '`from`': ''+Math.random(), body: ''+Math.random(), data: '', createdAt: now },
      { '`to`': '+15559999999', '`from`': ''+Math.random(), body: ''+Math.random(), data: '', createdAt: now },
    ]
  },
];
