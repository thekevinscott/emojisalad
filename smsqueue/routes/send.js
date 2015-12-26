'use strict';
const Promise = require('bluebird');
const Message = require('db').MessageSent;
const sms = require('sms');
//const moment = require('moment');

module.exports = Promise.coroutine(function* (req, res) {
  console.debug('\n================smsqueue send=================\n');
  console.debug(req.body.from, req.body.body, req.body.to);

  try {
    let data = req.body;
    data = yield sms(data);
    const message = yield Message.create(data);
    return res.json(message);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: err.toString() });
    res.end();
  }
});
