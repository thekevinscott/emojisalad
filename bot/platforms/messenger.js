'use strict';
/*
 * An incoming message from Messenger will contain the following:
 *
 *
 * playername: 'foo'
 * body: 'yes'
 */
//var Log = require('../models/log');
//var Player = require('../models/player');
//var Message = require('../models/message');
module.exports = function(req, res) {
  console.log(req.body);
  return res.json({ message: 'You say: '+req.body.message});
  //console.log('\n====================================\n');
  //Log.incoming(req.body);

  /*
  var body = req.body.message;
  var playername = req.body.playername;
  var platform = 'messenger';
  var entry = 'messenger';

  if ( ! playername ) {
    return res.json({ error: "You must provide a playername" });
  } else if ( ! body ) {
    return res.json({ error: "You must provide a message" });
  }

  Player.get({ 'messenger-name': playername }).then(function(player) {
    //console.log('back from player')
    if ( player ) {
      //console.log('got player in messenger', player);
      return script(player.state, player, body).then(function(response) {
        //console.log('script back', response);
        return response.map(function(r) {
          if ( typeof r === 'string' ) {
            return r;
          } else if ( r.message ) {
            return r.message;
          }
        }).filter(function(el) {
          return (el) ? el : null;
        });
      });
    } else {
      //console.log('player does not exist');
      // player does not yet exist; create the player
      return Player.create({ 'messenger-name': playername }, entry, platform).then(function() {
        return Message.get('intro').then(function(response) {
          // we wrap the response in an array to be consistent;
          // later responses could return multiple responses.
          return [response.message];
        });
      });
    }
  }).then(function(response) {
    res.json(response);
  }).fail(function(err) {
    console.error('some odd kind of messenger error', err);
  });
  */
};
