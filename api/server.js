'use strict';

const pmx = require('pmx');
const app = require('express')();

const d = require('node-discover')();
const port = process.env.PORT || 1338;

// advertise the service 
d.advertise({
  name: 'api',
  ready: false,
  port: port
});

app.set('port', port);

const bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.listen(app.get('port'), () => {
  console.debug(`EmojinaryFriend API: ${process.env.ENVIRONMENT}`);
  d.advertise({
    name: 'api',
    ready: true,
    port: port
  });
});

app.use(pmx.expressErrorHandler());

require('./controllers')(app);
