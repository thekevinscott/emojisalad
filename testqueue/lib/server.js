'use strict';
const queue = require('queue');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));

const base_url = 'http://localhost:' + process.env.PORT + '/';
const app = queue({
  name: 'testqueue',
  options: {
    port: require('config/app').port,
    db: require('config/db')
  },
  parse: require('lib/parse'),
  send: require('lib/send'),
  api: {
    phone: {
      parse: {
        endpoint: `${base_url}phone`,
        method: 'GET'
      }
    }
  }
});

app.get('/phone', (req, res) => {
  const number = req.query.number;
  res.json({ number: number });
});
