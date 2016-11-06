'use strict';
const config = require('config/mailgun');
const queue = require('queue');
const Promise = require('bluebird');
//const request = Promise.promisify(require('request'));
const fetch = require('isomorphic-fetch');

const port = process.env.PORT;

const endpoint = "http://localhost:" + require('config/app').port + "/";

const options = {
  port: require('config/app').port,
  db: require('config/db'),
  maintenance: {
    downForMaintenance: false,
    whitelist: []
  }
};

const { app } = queue({
  name: 'mail',
  options,
  parse: require('lib/parse'),
  send: require('lib/send'),
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
  //received: (req, res) => {
    //const url = `https://api:${config.apiKey}@api.mailgun.net/v3/${config.domain}/messages`;
    //console.log('url', url);
    //return fetch(url).then((result) => {
      //return res.json(result.body);
    //}).catch((err) => {
      //console.error('error', err);
    //});
  //}
});

//const phone = require('lib/phone');
//app.get('/phone', (req, res) => {
  //const number = req.query.number;

  //return phone(number).then((result) => {
    //res.json({ number : result });
  //}).catch((error) => {
    //res.json({ error });
  //});
//});

app.get('/', (req, res) => {
  res.send('root mail');
});
app.get('/senders', require('./senders'));
app.get('/senders/:sender', require('./senders').getSenderID);
