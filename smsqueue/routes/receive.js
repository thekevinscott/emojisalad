'use strict';
const Promise = require('bluebird');
const parse = require('parse');
const Message = require('db').MessageReceived;
const twilio = require('twilio');
const request = require('request');
const bot = require('config/services').bot;
Promise.promisifyAll(request);

module.exports = Promise.coroutine(function* (req, res) {
  console.debug('\n================smsqueue receive=================\n');
  console.debug(req.body);

  try {
    const parsedData = parse(req.body);
    yield Message.create(parsedData);
    const twiml = new twilio.TwimlResponse();
    // ping the bot here
    yield request.getAsync(bot.hook);
    return res.send(twiml.toString());
  } catch(err) {
    console.error(err);
    res.json(err);
  }
});
