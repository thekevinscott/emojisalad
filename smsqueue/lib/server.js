'use strict';

const port = process.env.PORT;

const endpoint = "http://localhost:" + require('config/app').port + "/";

console.info('endpoint for sms queue', endpoint);

const options = {
  port: require('config/app').port,
  db: require('config/db'),
  maintenance: require('config/maintenance')
};

const app = require('queue')({
  name: require('config/app').name,
  options,
  parse: require('lib/parse'),
  send: require('lib/sms'),
  maintenance: require('lib/maintenance'),
  api: {
    //phone: {
      //parse: {
        //endpoint: endpoint + 'phone',
        //method: 'GET'
      //}
    //},
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
