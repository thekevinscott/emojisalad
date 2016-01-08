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
  console.log('EmojinaryFriend API');
});

app.use(pmx.expressErrorHandler());

const main = require('main');
app.get('/ping', main);
main();
