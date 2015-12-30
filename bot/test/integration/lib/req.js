'use strict';
const Promise = require('bluebird');
const request = Promise.promisify(require("request"));
const _ = require('lodash');
const xml2js = Promise.promisifyAll(require('xml2js')).parseStringAsync; // example: xml2js 
const host = 'http://localhost:'+process.env.PORT;
const proxyquire =  require('proxyquire')
let message = {
  body: 'this needs to be filled out',
  to: 'this needs to be filled out',
  from: 'fill this out'
};

const main = proxyquire('main', {
  request: function(options, callback) {
    callback(null, [message]);
  }
});

const req = Promise.coroutine(function* (data, raw) {
  let player = data.player;
  if ( ! _.isObject(player) ) {
    console.error('player', player);
    throw "You must provide player as an object now";
  }

  message = {
    body: data.message,
    to: data.to || player.to,
    from: player.number
  };

  // main will return an array of promises
  // matching the messages waiting in the queue.
  // Because we are simulating a super fast queue,
  // we only ever have one message in the queue.
  let response = yield main();
  let body = response[0];

  if ( raw ) {
    return xml2js(body);
  } else {
    throw "when is this used";
    //return xml2js(body).then(function(data) {
      //try {
        //return data.Response.Message;
      //} catch(e) {
        //console.error('Error parsing XML response', e);
        //console.error(body);
      //}
    //});
  }
  return body;
});

module.exports = req;
