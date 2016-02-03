'use strict';
//const config = require('config/mailgun');
const queue = require('queue');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));

queue({
  name: 'Test Queue',
  options: {
    port: require('config/app').port,
    db: require('config/db')
  },
  parse: require('lib/parse'),
  send: require('lib/send'),
  //received: Promise.coroutine(function* (req, res) {
    //const url = `https://api:${config.apiKey}@api.mailgun.net/v3/${config.domain}/messages`;
    //console.log('url', url);
    //try {
      //const result = yield request({
        //method: 'GET',
        //url: url,
      //});
      //res.json(result.body);
    //} catch(err) {
      //console.error('error', err);
    //}
  //})
});
