'use strict';

const pmx = require('pmx');
const express = require('express');
const app = express();

app.set('port', (process.env.PORT || 5009));

const bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.post('/receive', require('./routes/receive'));
app.post('/send', require('./routes/send'));
app.get('/sent', require('./routes/sent'));
app.get('/received', require('./routes/received'));

app.listen(app.get('port'), function() {
  console.debug('SMS Queue');
});

app.use(pmx.expressErrorHandler());
