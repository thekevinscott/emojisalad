'use strict';

const pmx = require('pmx');
const app = require('express')();

app.set('port', (process.env.PORT || 5000));

const bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.listen(app.get('port'), function() {
  console.log('EmojinaryFriend Bot');
});

app.use(pmx.expressErrorHandler());

// Incoming requests take one of two forms
// Bot will either reach out to grab messages from the queue,
// on a cron schedule, or also has the ability to respond to a 'ping',
// which will trigger the script as well.
const main = require('main');
app.get('/ping', main);
main();
