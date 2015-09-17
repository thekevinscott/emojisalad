'use strict';
/*
 * Tests that asking for help works
 *
 */

const getUsers = require('../lib/getUsers');
const startGame = require('../flows/startGame');
const check = require('../lib/check');
const rule = require('../../../config/rule');
const help = rule('help').example();

describe.only('Help', function() {
  describe('Submitter', function() {
  // should give help to a submitter before they submit their clue
  // should give help to a submitter after they submit their clue
    it('should give help when a user asks for it and not notify anyone else', function() {
      var users = getUsers(3);

      return startGame(users).then(function(game) {
        console.log(game.round);
        return check(
          { user: game.round.submitter, msg: help },
          [
            { key: 'help-submitter-1', options: [users[1].nickname, 'MOVIE'], to: game.round.submitter },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });
  });

  describe('Player', function() {
  // should give help to a player while they're on the bench
  // should give help to a player while they're waiting for a clue
  // should give help to a player during a game
  // should give help to a player after a round
  });
});
