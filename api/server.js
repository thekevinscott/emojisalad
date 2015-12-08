'use strict';
// set require path
require('app-module-path').addPath(__dirname);

const pmx = require('pmx');
const express = require('express');
const app = express();

let DEBUG = false;
console.debug = function() {
  if ( DEBUG ) {
    console.log.apply(null, arguments);
  }
};
pmx.action('debug:on', function(reply) {
  DEBUG = true;
  reply({DEBUG : DEBUG});
});
pmx.action('debug:off', function(reply) {
  DEBUG = false;
  reply({DEBUG : DEBUG});
});

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

// this handles all replies
app.post('/platform/:platform', require('./platforms/'));

require('./cron');

app.listen(app.get('port'), function() {
  console.log('EmojinaryFriend API');
});

app.use(pmx.expressErrorHandler());
