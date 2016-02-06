'use strict';

const pmx = require('pmx');
const app = require('express')();

const service = require('microservice-registry');

service.register('api',{
  services: ['testqueue']
});

const port = process.env.PORT || 1338;

app.set('port', port);

const bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.listen(app.get('port'), () => {
  console.debug(`EmojinaryFriend API: ${process.env.ENVIRONMENT}`);
  console.log('who is ready ?????');
  service.ready().then(function() {
    console.log('EVERYBODY READY');
    console.log(service.get('testqueue'));
  });
});

app.use(pmx.expressErrorHandler());

require('./controllers')(app);
