'use strict';

const port = process.env.PORT;

const endpoint = "http://localhost:" + require('config/app').port + "/";

console.info('endpoint for fb queue', endpoint);

const options = {
  port: require('config/app').port,
  db: require('config/db'),
  maintenance: require('config/maintenance')
};

const app = require('queue')({
  name: require('config/app').name,
  options,
  parse: require('lib/parse'),
  send: require('lib/send'),
  maintenance: require('lib/maintenance'),
  api: {
    senders: {
      getID: {
        endpoint: `${endpoint}senders/:sender`,
        method: 'GET'
      },
      get: {
        endpoint: `${endpoint}senders`,
        method: 'GET'
      }
    }
  }
});

app.get('/senders', require('./senders'));
app.get('/senders/:sender', require('./senders').getSenderID);
app.get('/', (req, res) => {
  res.send('fb root');
});
app.get('/receive', require('./verify'));
