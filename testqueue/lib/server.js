'use strict';
const queue = require('queue');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));

const base_url = 'http://localhost:' + process.env.PORT + '/';
const { app } = queue({
  name: 'testqueue',
  options: {
    port: require('config/app').port,
    db: require('config/db')
  },
  POST_LIMIT: '30mb',
  parse: require('lib/parse'),
  send: require('lib/send'),
  api: {
    //phone: {
      //parse: {
        //endpoint: `${base_url}phone`,
        //method: 'GET'
      //}
    //},
    senders: {
      getID: {
        endpoint: `${base_url}senders/:sender`,
        method: 'GET'
      },
      get: {
        endpoint: `${base_url}senders`,
        method: 'GET'
      }
    }
  }
});

app.get('/phone', (req, res) => {
  const number = req.query.number;
  res.json({ number });
});

app.get('/senders', require('./senders'));
app.get('/senders/:sender', require('./senders').getSenderID);
