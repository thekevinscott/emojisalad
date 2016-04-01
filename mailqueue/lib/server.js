'use strict';
const config = require('config/mailgun');
const queue = require('queue');
const Promise = require('bluebird');
//const request = Promise.promisify(require('request'));
const fetch = require('isomorphic-fetch');

queue({
  options: {
    port: require('config/app').port,
    db: require('config/db')
  },
  parse: require('lib/parse'),
  send: require('lib/send')
  //received: (req, res) => {
    //const url = `https://api:${config.apiKey}@api.mailgun.net/v3/${config.domain}/messages`;
    //console.log('url', url);
    //return fetch(url).then((result) => {
      //return res.json(result.body);
    //}).catch((err) => {
      //console.error('error', err);
    //});
  //}
});
