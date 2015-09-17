'use strict';
/*
 * Tests that passing during a round works
 *
 */

const Game = require('../../../models/game');
const User = require('../../../models/user');
const getUsers = require('../lib/getUsers');
const startGame = require('../flows/startGame');
const playGame = require('../flows/playGame');
const invite = require('../flows/invite');
const check = require('../lib/check');
const setup = require('../lib/setup');
const rule = require('../../../config/rule');
const help = rule('help').example();
const guess = rule('guess').example();
const pass = rule('pass').example();
var submission = rule('submission').example();
var EMOJI = '😀';

describe('Pass', function() {
  it('should not let a player pass when they are not guessing', function() {
  });

  it('should not let a submitter pass when guessing', function() {
  });
  it('should not let a submitter pass when waiting for others to guess', function() {
  });
  /*
  it('should let a player pass during a round and allow the round to continue', function() {
    var users = getUsers(3);
    return playGame(users).then(function() {
      return check(
        { user: users[2], msg: pass },
        [
          { to: users[2], key: 'help-player-bench' },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should let a player pass during a round and end the round if there are no more players', function() {
    var users = getUsers(2);
    return playGame(users).then(function() {
      return check(
        { user: users[2], msg: pass },
        [
          { to: users[2], key: 'help-player-bench' },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should end a round if one player is out of guesses and the other player passes', function() {
  });
  it('should end a round if one player passes and the other player runs out of guesses', function() {
  });
  it('should end a round if both players pass', function() {
  });
  it('should not let a user ask for a clue if they have passed', function() {
  });
  it('should not let a user pass if they have run out of guesses', function() {
  });
  it('should not let a user guess if they have already passed', function() {
  });
  */
});
