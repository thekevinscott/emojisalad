'use strict';
const Promise = require('bluebird');
const parse = require('parse');
const Message = require('db').MessageReceived;
const twilio = require('twilio');

module.exports = Promise.coroutine(function* (req, res) {
  console.debug('\n================smsqueue receive=================\n');
  console.debug(req.body.From, req.body.Body, req.body.To);
  console.debug('req headers from twilio', req.headers.host);

  try {
    const data = parse(req.body);
    yield Message.create(data);
    const twiml = new twilio.TwimlResponse();
    // ping the bot here
    return res.send(twiml.toString());
  } catch(err) {
    console.error(err);
    res.json(err);
  }
});
