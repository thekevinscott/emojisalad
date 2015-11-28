'use strict';
/*
 * An incoming POST from the website will contain the following:
 *
 * number: (860) 460-8183
 *
 */
const Player = require('../models/player');
const Phone = require('../models/phone');
const TextModel = require('../models/text');
const Message = require('../models/message');

module.exports = function(req, res) {
  console.log('\n================web=================\n');

  console.log('req from web', req);

  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  var platform = 'twilio';
  var entry = 'web';

  if ( !req.body.number ) {
    return res.json({ error: 'You must provide a valid number' });
  }

  var player;
  Phone.parse(req.body.number).then(function(number) {
    return Player.create({ number: number }, entry, platform);
  }).then(function(newPlayer) {
    player = newPlayer;

    return Message.get('intro');
  }).then(function(message) {
    return TextModel.send(player, message);
  }).then(function() {
    res.json({});
  }).fail(function(err) {
    console.log('error creating player / sending text', err);
    if ( err.message ) {
      // possible error - number is already registered.
      res.json({ error: err.message });
    }
  });
};
