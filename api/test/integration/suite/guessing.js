/*
 * Tests that guessing works
 *
 */

var expect = require('chai').expect;

var getUsers = require('../lib/getUsers');
var playGame = require('../flows/playGame');
var setup = require('../lib/setup');
var check = require('../lib/check');

describe('Guessing', function() {
  this.timeout(60000);

  it('should be able to successfully guess', function() {
    var users = getUsers(3);

    return playGame(users).then(function(game) {
      var msg2 = 'SILENCE OF THE LAMBS';
      var guess = 'guess '+game.round.phrase;
      return check(
        { user: users[1], msg: guess },
        [
          { key: 'says', options: [users[1].nickname, guess], to: users[0] },
          { key: 'says', options: [users[1].nickname, guess], to: users[2] },
          { key: 'correct-guess', options: [users[1].nickname], to: users[0] },
          { key: 'correct-guess', options: [users[1].nickname], to: users[1] },
          { key: 'correct-guess', options: [users[1].nickname], to: users[2] },
          { key: 'game-next-round', options: [users[1].nickname], to: users[0] },
          { key: 'game-next-round-suggestion', options: [users[1].nickname, msg2], to: users[1] },
          { key: 'game-next-round', options: [users[1].nickname], to: users[2] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

  });

  it('should be able to successfully guess with case insensitivity', function() {
    var users = getUsers(3);

    return playGame(users).then(function(game) {
      var msg2 = 'SILENCE OF THE LAMBS';
      var guess = 'guess '+game.round.phrase.toLowerCase();
      return check(
        { user: users[1], msg: guess },
        [
          { key: 'says', options: [users[1].nickname, guess], to: users[0] },
          { key: 'says', options: [users[1].nickname, guess], to: users[2] },
          { key: 'correct-guess', options: [users[1].nickname], to: users[0] },
          { key: 'correct-guess', options: [users[1].nickname], to: users[1] },
          { key: 'correct-guess', options: [users[1].nickname], to: users[2] },
          { key: 'game-next-round', options: [users[1].nickname], to: users[0] },
          { key: 'game-next-round-suggestion', options: [users[1].nickname, msg2], to: users[1] },
          { key: 'game-next-round', options: [users[1].nickname], to: users[2] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should be notified on an incorrect guess', function() {
    var users = getUsers(3);

    return playGame(users).then(function(game) {
      var guess = 'guess foo';
      return check(
        { user: users[1], msg: guess },
        [
          { key: 'says', options: [users[1].nickname, guess], to: users[0] },
          { key: 'says', options: [users[1].nickname, guess], to: users[2] },
          { key: 'incorrect-guess', options: [users[1].nickname], to: users[0] },
          { key: 'incorrect-guess', options: [users[1].nickname], to: users[1] },
          { key: 'incorrect-guess', options: [users[1].nickname], to: users[2] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should send a sad message when you run out of guesses', function() {
    var users = getUsers(3);

    var guess = 'guess foo';
    return playGame(users).then(function(game) {
      return setup([
        { user: users[1], msg: guess }
      ]);
    }).then(function() {
      return check(
        { user: users[1], msg: guess },
        [
          { key: 'says', options: [users[1].nickname, guess], to: users[0] },
          { key: 'says', options: [users[1].nickname, guess], to: users[2] },
          { key: 'incorrect-out-of-guesses', to: users[0] },
          { key: 'incorrect-out-of-guesses', to: users[1] },
          { key: 'incorrect-out-of-guesses', to: users[2] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should chide you if you continue to guess after running out of guesses', function() {
    var users = getUsers(3);

    var guess = 'guess foo';
    return playGame(users).then(function(game) {
      return setup([
        { user: users[1], msg: guess },
        { user: users[1], msg: guess },
      ]);
    }).then(function() {
      return check(
        { user: users[1], msg: guess },
        [
          { key: 'says', options: [users[1].nickname, guess], to: users[0] },
          { key: 'says', options: [users[1].nickname, guess], to: users[2] },
          { key: 'out-of-guesses', options: [users[1].nickname], to: users[0] },
          { key: 'out-of-guesses', options: [users[1].nickname], to: users[1] },
          { key: 'out-of-guesses', options: [users[1].nickname], to: users[2] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should allow one user to guess, the other user to guess, and then catch the first user guessing a second time and boot them', function() {
    var users = getUsers(3);

    var guess = 'guess foo';
    return playGame(users).then(function(game) {
      return setup([
        { user: users[1], msg: guess },
        { user: users[2], msg: guess },
        { user: users[1], msg: guess },
      ]);
    }).then(function() {
      return check(
        { user: users[1], msg: guess },
        [
          { key: 'says', options: [users[1].nickname, guess], to: users[0] },
          { key: 'says', options: [users[1].nickname, guess], to: users[2] },
          { key: 'out-of-guesses', options: [users[1].nickname], to: users[0] },
          { key: 'out-of-guesses', options: [users[1].nickname], to: users[1] },
          { key: 'out-of-guesses', options: [users[1].nickname], to: users[2] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should allow a user to fail miserably and the other one can still win', function() {
    var users = getUsers(3);

    var guess = 'guess foo';
    var msg2 = 'SILENCE OF THE LAMBS';

    return playGame(users).then(function(game) {
      return setup([
        { user: users[1], msg: guess },
        { user: users[2], msg: guess },
        { user: users[1], msg: guess },
      ]);
    }).then(function() {
      var correct = 'guess jurassic park';
      return check(
        { user: users[2], msg: correct },
        [
          { key: 'says', options: [users[2].nickname, correct], to: users[0] },
          { key: 'says', options: [users[2].nickname, correct], to: users[1] },
          { key: 'correct-guess', options: [users[2].nickname], to: users[0] },
          { key: 'correct-guess', options: [users[2].nickname], to: users[1] },
          { key: 'correct-guess', options: [users[2].nickname], to: users[2] },
          { key: 'game-next-round', options: [users[1].nickname], to: users[0] },
          { key: 'game-next-round-suggestion', options: [users[1].nickname, msg2], to: users[1] },
          { key: 'game-next-round', options: [users[1].nickname], to: users[2] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should really get sad if everyone fails and then start a new round', function() {
    var users = getUsers(3);

    var guess = 'guess foo';
    var msg2 = 'SILENCE OF THE LAMBS';

    return playGame(users).then(function(game) {
      return setup([
        { user: users[1], msg: guess },
        { user: users[2], msg: guess },
        { user: users[1], msg: guess },
      ]);
    }).then(function() {
      return check(
        { user: users[2], msg: guess },
        [
          { key: 'says', options: [users[2].nickname, guess], to: users[0] },
          { key: 'says', options: [users[2].nickname, guess], to: users[1] },
          { key: 'round-over', options: [users[2].nickname], to: users[0] },
          { key: 'round-over', options: [users[2].nickname], to: users[1] },
          { key: 'round-over', options: [users[2].nickname], to: users[2] },
          { key: 'game-next-round', options: [users[1].nickname], to: users[0] },
          { key: 'game-next-round-suggestion', options: [users[1].nickname, msg2], to: users[1] },
          { key: 'game-next-round', options: [users[1].nickname], to: users[2] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

});
