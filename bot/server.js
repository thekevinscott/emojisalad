'use strict';
// set require path
require('app-module-path').addPath(__dirname);

const pmx = require('pmx');
const express = require('express');
const app = express();

app.set('port', (process.env.PORT || 5000));

const bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.get('/test', function(req, res) {
  console.log('test works');
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.json({ success: 1 });
});

const bot = require('config/services').bot;
const request = require('request');
const Promise = require('bluebird');
Promise.promisifyAll(request);

app.get('/ping', Promise.coroutine(function* (req, res) {
  const response = yield request.getAsync([
    bot.host,
    ':',
    bot.port,
    '/received'
  ].join(''));
  
  let messages = response[1];
  try {
    messages = JSON.parse(messages);
  } catch(err) {}

  messages.map(function(message) {
    req.body = {
      From: message.from,
      To: message.to,
      Body: message.body,
    }
    //console.log('body', req.body);
    //return require('./platforms/twilio')(req, res);
  });
  // query for recent messages
  // if there are any messages
}));

app.post('/platform/:platform', function(req, res) {
  return require('./platforms')(req, res);
});

require('./cron');

app.listen(app.get('port'), function() {
  console.log('EmojinaryFriend API');
});

app.use(pmx.expressErrorHandler());
