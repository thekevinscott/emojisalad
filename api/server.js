'use strict';

const pmx = require('pmx');
const app = require('express')();

app.set('port', (process.env.PORT || 1338));

const bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.listen(app.get('port'), function() {
  console.debug(`EmojinaryFriend API: ${process.env.ENVIRONMENT}`);
});

app.use(pmx.expressErrorHandler());

require('./routes')(app);
