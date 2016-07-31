'use strict';

const pmx = require('pmx');
const app = require('express')();
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
const Promise = require('bluebird');

const registry = require('microservice-registry');

const endpoint = 'http://localhost:' + port + '/';

const PROTOCOLS = process.env.PROTOCOLS;
if ( ! PROTOCOLS ) {
  throw new Error("You must provide comma separated PROTOCOLS");
}

const requiredServices = PROTOCOLS.split(',').concat([
  'api'
]);
registry.register('bot', {
  services: requiredServices,
  api: {
    ping: {
      endpoint: endpoint + 'ping',
      method: 'GET',
      description: 'An endpoint for calling back the Bot'
    }
  }
});

app.set('port', port);

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(pmx.expressErrorHandler());

let ping = (req, res) => {
  res.json({ error: 'Services not loaded yet' });
  res.end();
};
app.listen(port, () => {
  const listener = setTimeout(() => {
    console.info('Still waiting for', requiredServices);
  }, 5000);
  app.get('/ping', (req, res) => {
    ping(req, res);
  });

  registry.ready(() => {
    clearTimeout(listener);
    console.info(`EmojinaryFriend Bot: ${port} ${PROTOCOLS}`);

    // Incoming requests take one of two forms
    // Bot will either reach out to grab messages from the queue,
    // on a cron schedule, or also has the ability to respond to a 'ping',
    // which will trigger the script as well.
    const main = require('main');
    ping = main;
    main();
  });
});
