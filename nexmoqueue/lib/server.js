'use strict';

const port = process.env.PORT;
const ENVIRONMENT = process.env.ENVIRONMENT || 'development';

const endpoint = `http://localhost:${require('config/app').port}/`;

console.info('endpoint for nexmo queue', endpoint);

const options = {
  port: require('config/app').port,
  db: require(`config/database/${ENVIRONMENT}`),
};

const app = require('queue')({
  name: require('config/app').name,
  options,
  parse: require('lib/parse'),
  send: require('lib/sms'),
  //receive: (req, res) => {
    //const params = req.body;
    //let incomingData = {
      //messageId: params.messageId,
      //from: params.msisdn,
      //text: params.text,
      //type: params.type,
      //timestamp: params['message-timestamp']
    //};
    //res.send(incomingData);
  //},
  postReceive: require('lib/postReceive'),
  preprocessSend: require('lib/preprocessSend'),
  POST_LIMIT: '60mb',
  api: {
    phone: {
      endpoint: `${endpoint}phone`,
      method: 'GET',
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
  },
});

const phone = require('lib/phone');
app.get('/phone', (req, res) => {
  const number = req.query.number;

  return phone(number).then((result) => {
    res.json({ number: result });
  }).catch((error) => {
    res.json({ error });
  });
});

app.get('/senders', require('./senders'));
app.get('/senders/:sender', require('./senders').getSenderID);
app.get('/', (req, res) => {
  res.send('I am the nexmo');
});

app.post('/delivery', require('./delivery'));
app.get('/jungle', require('./jungle'));
