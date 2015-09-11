/*
 * Tests that clues work
 *
 */

var expect = require('chai').expect;
var req = require('./lib/req');
var Message = require('../../../models/Message');
var Round = require('../../../models/Round');
var sprint = require('sprintf');
var Promise = require('bluebird');

var getUsers = require('./lib/getUsers');
var startGame = require('./flows/startGame');
var playGame = require('./flows/playGame');
var setup = require('./lib/setup');
var check = require('./lib/check');

var EMOJI = '😀';

describe('Clues', function() {
  this.timeout(60000);
  var msg = 'Jurassic Park';
  var msg2 = 'SILENCE OF THE LAMBS';

  it('should notify all the other users when somebody asks for a clue', function() {
    var users = getUsers(3);

    return playGame(users).then(function() {
      return check(
        { user: users[1], msg: 'CLUE' },
        [
          { key: 'says', options: [users[1].nickname, 'CLUE'], to: users[0] },
          { key: 'says', options: [users[1].nickname, 'CLUE'], to: users[2] },
          { key: 'clue', options: [users[1].nickname, 'MOVIE'], to: users[0] },
          { key: 'clue', options: [users[1].nickname, 'MOVIE'], to: users[1] },
          { key: 'clue', options: [users[1].nickname, 'MOVIE'], to: users[2] }
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should not allow the submitter to ask for a clue', function() {
    var users = getUsers(3);

    return playGame(users).then(function() {
      return check(
        { user: users[0], msg: 'CLUE' },
        [
          { key: 'says', options: [users[0].nickname, 'CLUE'], to: users[1] },
          { key: 'says', options: [users[0].nickname, 'CLUE'], to: users[2] },
          { key: 'no-clue-for-submitter', options: [users[0].nickname], to: users[0] },
          { key: 'no-clue-for-submitter', options: [users[0].nickname], to: users[1] },
          { key: 'no-clue-for-submitter', options: [users[0].nickname], to: users[2] }
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should not allow more than one clue', function() {
    var users = getUsers(3);

    return playGame(users).then(function() {
      return setup([
        { user: users[1], msg: 'CLUE' }
      ]);
    }).then(function() {
      return check(
        { user: users[1], msg: 'CLUE' },
        [
          { key: 'says', options: [users[1].nickname, 'CLUE'], to: users[0] },
          { key: 'says', options: [users[1].nickname, 'CLUE'], to: users[2] },
          { key: 'no-more-clues-allowed', options: ['1 clue'], to: users[0] },
          { key: 'no-more-clues-allowed', options: ['1 clue'], to: users[1] },
          { key: 'no-more-clues-allowed', options: ['1 clue'], to: users[2] }
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

  });

  it('should fail gracefully if no more clues exist', function() {
    var users = getUsers(3);

    return playGame(users, { clues_allowed: 99 }).then(function() {
      return setup([
        { user: users[1], msg: 'CLUE' },
        { user: users[1], msg: 'CLUE' },
        { user: users[1], msg: 'CLUE' },
      ]);
    }).then(function() {
      return check(
        { user: users[1], msg: 'CLUE' },
        [
          { key: 'says', options: [users[1].nickname, 'CLUE'], to: users[0] },
          { key: 'says', options: [users[1].nickname, 'CLUE'], to: users[2] },
          { key: 'no-more-clues-available', to: users[0] },
          { key: 'no-more-clues-available', to: users[1] },
          { key: 'no-more-clues-available', to: users[2] }
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });
});
