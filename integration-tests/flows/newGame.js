'use strict';
const Promise = require('bluebird');
const setup = require('../lib/setup');
const sequence = require('../lib/sequence');
const invite = require('./invite');
const rule = require('config/rule');
const Player = require('models/player');
//const Game = require('models/game');
//const Round = require('models/round');
const _ = require('lodash');

// submit any old emoji to start a round
const EMOJI = '😀';

// invite a particular player and have them sign up
const newGame = Promise.coroutine(function* (players, options) {
  if ( ! options ) { options = {}; }
  let inviter = _.clone(players).shift();
  const response = yield setup([
    { player: inviter, msg: rule('new-game').example() }
  ]);

  const to = response[0].Response.Sms[0].$.to; // the receiving user
  const from = response[0].Response.Sms[0].$.from; // game number

  // this is flipped; the response's to field
  // is our player's from field.
  //
  // aka, the system sends a message TO a specific
  // number, and that number is what we send messages
  // FROM as a user.
  inviter.to = from;
  inviter.from = to;
  // set id
  inviter = yield Player.get(inviter);

  yield sequence(players.map((player) => {
    return () => {
      return invite(inviter, player);
    };
  }));

  const msg = {
    player: inviter,
    msg: EMOJI,
    to: inviter.game_number
  };

  return setup([msg]);

  //const game = yield Game.get({ player: inviter });
  //return Game.get({ player: inviter }).then((game) => {
  //});

  //return game;
});

module.exports = newGame;
