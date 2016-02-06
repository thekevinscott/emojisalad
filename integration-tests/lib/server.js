'use strict';

const app = require('express')();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3999;

app.set('port', port);

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.listen(port);

module.exports = app;
