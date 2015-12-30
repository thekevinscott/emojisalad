'use strict';
const Promise = require('bluebird');
const Message = require('db').MessageSent;
const sms = require('sms');
//const moment = require('moment');

module.exports = Promise.coroutine(function* (req, res) {
  console.debug('\n================smsqueue send=================\n');
  console.debug(req.body);

  if ( ! req.body.messages ) {
    res.json({ error: "You must provide messages"});
  }

  try {
    //let data = req;
    const responses = yield Promise.all(req.body.messages.map(sendSms));
    return res.json(responses);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: err.toString() });
    res.end();
  }
});

const sendSms = Promise.coroutine(function* (data) {
  // this should be two functions; a preprocessor and a sender
  const parsedData = yield sms(data);
  return yield Message.create(parsedData);
});
