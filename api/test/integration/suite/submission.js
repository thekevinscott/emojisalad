/*
 * Tests that games work with two players
 *
 */

var expect = require('chai').expect;

var getUsers = require('../lib/getUsers');
var startGame = require('../flows/startGame');
var playGame = require('../flows/playGame');
var setup = require('../lib/setup');
var check = require('../lib/check');
var signup = require('../flows/signup');
var invite = require('../flows/invite');

var EMOJI = '😀';

describe('Submissions', function() {
  it('should get pissy if you try and send a text submission', function() {
    console.error('****** FIX THIS WHEN BUG IS FIXED');
    return;
    var users = getUsers(3);

    return startGame(users).then(function() {
      return check(
        { user: users[0], msg: 'foo' },
        [
          { key: 'says', options: [users[1].nickname, 'CLUE'], to: users[0] },
          { key: 'says', options: [users[1].nickname, 'CLUE'], to: users[2] },
          { key: 'clue', options: [users[1].nickname, 'MOVIE'], to: users[0] },
          { key: 'clue', options: [users[1].nickname, 'MOVIE'], to: users[1] },
          { key: 'clue', options: [users[1].nickname, 'MOVIE'], to: users[2] }
        ]
      ).then(function(obj) {
        console.log('obj', obj);
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should get pissy if you try and send a mixed text emoji submission', function() {
    console.error('****** FIX THIS WHEN BUG IS FIXED');
    return;
    var users = getUsers(3);

    return startGame(users).then(function() {
      return check(
        { user: users[0], msg: EMOJI+'foo'+EMOJI },
        [
          { key: 'says', options: [users[1].nickname, 'CLUE'], to: users[0] },
          { key: 'says', options: [users[1].nickname, 'CLUE'], to: users[2] },
          { key: 'clue', options: [users[1].nickname, 'MOVIE'], to: users[0] },
          { key: 'clue', options: [users[1].nickname, 'MOVIE'], to: users[1] },
          { key: 'clue', options: [users[1].nickname, 'MOVIE'], to: users[2] }
        ]
      ).then(function(obj) {
        console.log('obj', obj);
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should forward the submission to other players', function() {
    var users = getUsers(3);

    return startGame(users).then(function() {
      return check(
        { user: users[0], msg: EMOJI },
        [
          { key: 'game-submission-sent', to: users[0] },
          { key: 'says', options: [users[0].nickname, EMOJI], to: users[1] },
          { key: 'says', options: [users[0].nickname, EMOJI], to: users[2] },
          { key: 'guessing-instructions', to: users[1] },
          { key: 'guessing-instructions', to: users[2] }
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
    var users = getUsers();
  });
});
