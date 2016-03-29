'use strict';

const pmx = require('pmx');
const app = require('express')();

const service = require('microservice-registry');

const port = process.env.PORT || 1338;

service.register('api',{
  services: ['testqueue'],
  api: require('./manifest')(port)
});

app.set('port', port);

app.use((req, res, next) => {
  console.log('use');
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.listen(app.get('port'), () => {
  console.info(`EmojinaryFriend API: ${process.env.ENVIRONMENT}`);
  service.ready();
});

app.use(pmx.expressErrorHandler());

require('./controllers')(app);
