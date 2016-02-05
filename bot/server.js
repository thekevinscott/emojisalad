'use strict';

const pmx = require('pmx');
const app = require('express')();
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;

app.set('port', port);

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


app.use(pmx.expressErrorHandler());

const init = () => {
  app.listen(port, () => {
    console.debug('EmojinaryFriend Bot');
    //d.advertise({
      //name: 'bot',
      //ready: true,
      //port: port,
      //hook: `http://localhost:${port}/ping`
    //});

    // Incoming requests take one of two forms
    // Bot will either reach out to grab messages from the queue,
    // on a cron schedule, or also has the ability to respond to a 'ping',
    // which will trigger the script as well.
    const main = require('main');
    app.get('/ping', main);
    main();
  });
}

const services = require('./services').init(port).then(() => {
  init();
});
