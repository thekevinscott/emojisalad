'use strict';

import registry from 'microservice-registry';
import http from 'http';
import express from 'express';
import bootstrapWebsocket from './websocket';
import bootstrapREST from './rest';
import manifest from './manifest';
import {
  NAME,
  PORT,
  REQUIRED_SERVICES,
} from 'config/app';

const server = http.createServer();
const app = express();

bootstrapWebsocket(server);
bootstrapREST(app);

registry.register(NAME, {
  api: manifest,
  services: REQUIRED_SERVICES,
});

console.info('Waiting for SMS queue and API');
registry.ready(() => {
  console.info(`Starting up EmojinaryFriend App Queue: ${PORT}`);
  server.on('request', app);

  server.listen(PORT, () => {
    console.info(NAME, PORT);
    registry.ready();
  });
});


const Pusher = require('pusher');

const pusher = new Pusher({
  appId: '236009',
  key: '64297db42152849faef9',
  secret: '1a755792726bf38ea8bd',
  //encrypted: true,
});

pusher.trigger('test_channel', 'my_event', {
  message: 'hello world',
});

pusher.notify(['donuts'], {
  apns: {
    aps: {
      alert: {
        body: 'donuts!',
      },
    },
  },

  webhook_url: 'http://requestb.in/xcehthxc',
  webhook_level: 'DEBUG',
});
console.log('here we go', pusher);
