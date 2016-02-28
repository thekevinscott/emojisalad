'use strict';

const port = process.env.PORT || params.options.port;

const endpoint = "http://localhost:" + port + "/";
const app = require('queue')({
  name: require('config/app').name,
  options: {
    port: require('config/app').port,
    db: require('config/db')
  },
  parse: require('lib/parse'),
  send: require('lib/sms'),
  api: {
    phone: {
      parse: {
        endpoint: endpoint + 'phone',
        method: 'GET'
      }
    }
  }
});

const phone = require('lib/phone');
app.get('/phone', (req, res) => {
  const number = req.query.number;

  return phone(number).then((result) => {
    res.json({ number : result });
  }).catch((error) => {
    res.json({ error : error });
  });
});
