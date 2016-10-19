'use strict'; const _ = require('lodash');
const router = require('routes');
//const Phone = require('models/phone');
//const Player = require('models/player');
//const User = require('models/user');
const Message = require('models/message');
//const Promise = require('bluebird');
const concatenate = require('lib/concatenateMessages');
//const req = Promise.promisify(require('request'));

module.exports = (message) => {
  console.info('==========process message===========', message);
  if ( ! message.from ) {
    throw new Error("No from provided");
  }
  //if ( ! message.to ) {
    //throw new Error("No to provided");
  //}
  if ( ! message.body ) {
    // this might be an mms
    console.error('No body provided, but it might be an mms', message);
    throw new Error("No body provided");
  }

  // responses comes back as an array of messages
  return router({
    from: message.from,
    message: message.body,
    to: message.to,
    protocol: message.protocol,
  }).then((responses) => {
    //console.info('responses back', responses);
    if ( responses && _.isArray(responses) && responses.length ) {
      return Message.parse(responses, message).then((response) => {
        //console.info('response from router', response);
        return response;
      });
    }
  });
};
