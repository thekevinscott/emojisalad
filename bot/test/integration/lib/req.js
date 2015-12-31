'use strict';
const Promise = require('bluebird');
const Twilio = require('models/twilio');
const request = Promise.promisify(require("request"));
const _ = require('lodash');
const xml2js = Promise.promisifyAll(require('xml2js')).parseStringAsync; // example: xml2js 
const host = 'http://localhost:'+process.env.PORT;
const proxyquire =  require('proxyquire')

//const handle = proxyquire('main', {
  //'./platforms/twilio2': proxyquire('../../../platforms/twilio2', {
    //'models/phone': {
      //parse: function(phones) {
        //return new Promise(function(resolve) {
          //resolve(phones);
        //});
      //}
    //}
  //})
//}).handle;

const handle = require('main').handle;

const req = Promise.coroutine(function* (data, raw) {
  const player = data.player;
  if ( ! _.isObject(player) ) {
    console.error('player', player);
    throw "You must provide player as an object now";
  }

  const message = {
    body: data.message,
    to: data.to || player.to,
    from: player.number
  };

  // main will return an array of promises
  // matching the messages waiting in the queue.
  // Because we are simulating a super fast queue,
  // we only ever have one message in the queue.
  //let response = yield main(message);
  //let body = response[0];
  const messages = yield handle(message);
  let twiml = yield Twilio.parse(messages);
  const body = twiml.toString();
  //const body = response;

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
