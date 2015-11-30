'use strict';
const setup = require('../lib/setup');
const sequence = require('../lib/sequence');
const invite = require('./invite');
const rule = require('config/rule');
const Player = require('models/player');
const Game = require('models/game');
const Round = require('models/round');
const setNonRandomGame = require('../lib/setNonRandomGame');

// submit any old emoji to start a round
const EMOJI = 'ðŸ˜€';

// invite a particular player and have them sign up
function newGame(players, options) {
  if ( ! options ) { options = {}; }
  let inviter = players.shift();
  return setup([
    { player: inviter, msg: rule('new-game').example() },
  ]).then(function(response) {
    //console.log('el responso', response[0].Response.Sms[0]);
    inviter.game_number = response[0].Response.Sms[0].$.from;
    return Player.get(inviter);
  }).then(function(player) {
    inviter = player;
    return Game.get({ player: inviter }).then(function(game) {
      return setNonRandomGame(null, game).then(function() {
        return game;
      });
    }).then(function(game) {
      return sequence(players.map(function(player) {
        return function() {
          return invite(inviter, player, inviter.game_number);
        };
      })).then(function() {
        return setup([
          {
            player: inviter,
            msg: EMOJI,
            to: inviter.game_number
          }
        ]).then(function() {
          if ( options.clues_allowed ) {
            return Round.update(game.round, {
              clues_allowed: options.clues_allowed
            });
          }
        }).then(function() {
          return game;
        });
      });
    });
  });
}

module.exports = newGame;
