'use strict';

const registry = require('microservice-registry');
const server = require('http').createServer();
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ server });
// const WebSocket = require('ws');
const url = require('url');
const _ = require('lodash');
const pmx = require('pmx');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const service = require('microservice-registry');
const config = require('config/app');

const endpoint = `http://localhost:${config.port}/`;

app.use(pmx.expressErrorHandler());

const name = require('config/app').name || 'queue';

const api = _.assign({
  send: {
    endpoint: `${endpoint}send`,
    method: 'POST',
    description: 'An endpoint for sending messages through a particular queue',
  },
  sent: {
    endpoint: `${endpoint}sent`,
    method: 'GET',
    description: 'An endpoint for getting messages from a particular queue',
  },
  received: {
    endpoint: `${endpoint}received`,
    method: 'GET',
    description: 'An endpoint for getting all received messages from a particular timestamp',
  },
  senders: {
    getID: {
      endpoint: `${endpoint}senders/:sender`,
      method: 'GET',
    },
    get: {
      endpoint: `${endpoint}senders`,
      method: 'GET',
    },
  },
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

const receive = require('./receive');

app.get('/received', require('./received'));
app.get('/senders', require('./senders'));
app.get('/senders/:sender', require('./senders').getSenderID);
app.get('/', (req, res) => {
  res.send('app queue root');
});
app.post('/claim', require('./claim'));
app.get('/games', require('./games'));
app.get('/test', (req, res) => {
  res.json({ foo: 'bar' });
});

const routes = require('../routes');

const getMessages = require('../utils/getMessages');
wss.on('connection', (ws) => {
  const wsSend = (payload) => {
    const parsedPayload = JSON.stringify(payload);
    console.log('parsed payload', parsedPayload);
    ws.send(parsedPayload);
  };
  const location = url.parse(ws.upgradeReq.url, true);
  // you might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', message => {
    console.log('clients', wss.clients.length);
    routes(message).then(wsSend).catch(wsSend);
  });
});

// send saves it; if we have a connection, send it along
//app.post('/send', require('./send')(ws));
//

registry.register(name, {
  api,
  services: [
    'api',
    'sms',
  ],
});

console.info('Waiting for SMS queue and API');
registry.ready(() => {
  console.info(`Starting up EmojinaryFriend App Queue: ${config.port}`);
  server.on('request', app);

  server.listen(config.port, () => {
    console.info(config.name, config.port);
    service.ready();
  });
});

