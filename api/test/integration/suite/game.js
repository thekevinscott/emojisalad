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
var getGame = require('../lib/getGame');

var EMOJI = '😀';

describe('Game', function() {

  it('should initiate the game with the person who started it', function() {
    var users = getUsers(2);

    return signup(users[0]).then(function() {
      return setup([
        {user: users[0], msg: 'invite '+users[1].number},
        {user: users[1], msg: 'yes'},
      ]);
    }).then(function() {
      return check(
        {user: users[1], msg: users[1].nickname},
        [
          { key: 'accepted-invited', options: [users[1].nickname], to: users[0] },
          { key: 'accepted-inviter', options: [users[1].nickname, users[0].nickname], to: users[1] },
          { key: 'game-start', options: [users[0].nickname, 'JURASSIC PARK'], to: users[0] }
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should allow players to cross talk', function() {
    var users = getUsers(3);

    return playGame(users).then(function() {
      var msg = 'huh?';
      return check(
        { user: users[1], msg: msg },
        [
          { to: users[0], key: 'says', options: [users[1].nickname, msg] },
          { to: users[2], key: 'says', options: [users[1].nickname, msg] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should allow the submitter to cross talk', function() {
    var users = getUsers(3);

    return playGame(users).then(function() {
      var msg = 'just play';
      return check(
        { user: users[0], msg: msg },
        [
          { to: users[1], key: 'says', options: [users[0].nickname, msg] },
          { to: users[2], key: 'says', options: [users[0].nickname, msg] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should allow the second round to take a guess and move to the third round with the first submitter guessing in a two person game', function() {
    var users = getUsers(2);

    return playGame(users).then(function(game) {
      return setup([
        { user: users[1], msg: 'guess '+game.round.phrase },
        { user: users[1], msg: EMOJI },
      ]);
    }).then(function() {
      return getGame(users[0]);
    }).then(function(game) {
      var guess = 'guess '+game.round.phrase;
      var third_phrase = 'TIME AFTER TIME';
      return check(
        { user: users[0], msg: guess },
        [
          { to: users[1], key: 'says', options: [users[0].nickname, guess] },
          { to: users[0], key: 'correct-guess', options: [users[0].nickname] },
          { to: users[1], key: 'correct-guess', options: [users[0].nickname] },
          { to: users[0], key: 'game-next-round-suggestion', options: [users[0].nickname, third_phrase] },
          { to: users[1], key: 'game-next-round', options: [users[0].nickname] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

});
