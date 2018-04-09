'use strict';
const port = process.env.PORT;
const ENVIRONMENT = process.env.ENVIRONMENT || 'development';

const endpoint = "http://localhost:" + require('config/app').port + "/";

console.info('endpoint for web queue', endpoint);

const options = {
  port: require('config/app').port,
  db: require(`config/database/${ENVIRONMENT}`),
  maintenance: require('config/maintenance')
};

const { app } = require('queue')({
  name: require('config/app').name,
  options,
  receive: require('lib/receive'),
  received: require('lib/received'),
  send: require('lib/sms'),
  maintenance: require('lib/maintenance'),
  api: {
    receive: {
      receive: {
        method: 'POST',
        endpoint: `${endpoint}receive`
      }
    }
  }
});

const phone = require('lib/phone');
app.get('/phone', (req, res) => {
  const number = req.query.number;

  return phone(number).then((result) => {
    res.json({ number : result });
  }).catch((error) => {
    res.json({ error });
  });
});

app.get('/senders', require('./senders'));
app.get('/senders/:sender', require('./senders').getSenderID);
