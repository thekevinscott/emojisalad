'use strict';
//const Promise = require('bluebird');
//const request = Promise.promisify(require('request'));
const setup = require('../lib/setup');
const sequence = require('../lib/sequence');
const invite = require('./invite');
const rule = require('config/rule');
//const services = require('config/services');
//const port = services.api.port;
const _ = require('lodash');

// submit any old emoji to start a round
//const EMOJI = '😀';

// invite a particular player and have them sign up
const newGame = (players, options, expected_length) => {
  if ( ! options ) { options = {}; }
  const inviter = _.clone(players).shift();
  return setup([
    { player: inviter, msg: rule('new-game').example(), get_response: true }
  ], expected_length).then((response) => {
    const message = response[0].messages[0];

    // this is flipped; the response's to field
    // is our player's from field.
    //
    // aka, the system sends a message TO a specific
    // number, and that number is what we send messages
    // FROM as a user.
    inviter.to = message.from;
    inviter.from = message.to;

    return sequence(players.filter((player) => {
      return player.from !== inviter.from;
    }).map((player) => {
      return () => {
        player.to = inviter.to;
        return invite(inviter, player, false);
      };
    })).then(msg => {
      return msg;
    });
  });
};

module.exports = newGame;
