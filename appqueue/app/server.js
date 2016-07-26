'use strict';

import registry from 'microservice-registry';
import http from 'http';
import express from 'express';
import pmx from 'pmx';
import bodyParser from 'body-parser';
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

app.use(pmx.expressErrorHandler());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

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

