'use strict';
/*
 * Tests that guessing works
 *
 */

const getUsers = require('../lib/getUsers');
const playGame = require('../flows/playGame');
const setup = require('../lib/setup');
const check = require('../lib/check');
const rule = require('../../../config/rule');
const guess = rule('guess').example();
//const clue = rule('clue').example();
const submission = rule('submission').example();
const EMOJI = '😀';

describe('Guessing', function() {

  it('should be able to successfully guess', function() {
    let users = getUsers(3);

    return playGame(users).then(function(game) {
      let msg2 = 'SILENCE OF THE LAMBS';
      return check(
        { user: users[1], msg: guess + game.round.phrase },
        [
          { key: 'guesses', options: [users[1].nickname, game.round.phrase], to: users[0] },
          { key: 'guesses', options: [users[1].nickname, game.round.phrase], to: users[2] },
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
    let users = getUsers(3);

    return playGame(users).then(function(game) {
      let msg2 = 'SILENCE OF THE LAMBS';
      return check(
        { user: users[1], msg: guess + game.round.phrase.toLowerCase() },
        [
          { key: 'guesses', options: [users[1].nickname, game.round.phrase.toLowerCase()], to: users[0] },
          { key: 'guesses', options: [users[1].nickname, game.round.phrase.toLowerCase()], to: users[2] },
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
    let users = getUsers(3);

    return playGame(users).then(function() {
      let the_guess = 'foo';
      return check(
        { user: users[1], msg: guess + the_guess},
        [
          { key: 'guesses', options: [users[1].nickname, the_guess], to: users[0] },
          { key: 'guesses', options: [users[1].nickname, the_guess], to: users[2] },
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
    let users = getUsers(3);

    let the_guess = ' foo';
    return playGame(users).then(function() {
      return setup([
        { user: users[1], msg: guess + the_guess }
      ]);
    }).then(function() {
      return check(
        { user: users[1], msg: guess + the_guess },
        [
          { key: 'guesses', options: [users[1].nickname, the_guess.trim()], to: users[0] },
          { key: 'guesses', options: [users[1].nickname, the_guess.trim()], to: users[2] },
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
    let users = getUsers(3);

    let the_guess = 'foo';
    return playGame(users).then(function() {
      return setup([
        { user: users[1], msg: guess + the_guess },
        { user: users[1], msg: guess + the_guess },
      ]);
    }).then(function() {
      return check(
        { user: users[1], msg: guess + the_guess },
        [
          { key: 'guesses', options: [users[1].nickname, the_guess], to: users[0] },
          { key: 'guesses', options: [users[1].nickname, the_guess], to: users[2] },
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
    let users = getUsers(3);

    let the_guess = 'foo';
    return playGame(users).then(function() {
      return setup([
        { user: users[1], msg: guess + the_guess },
        { user: users[2], msg: guess + the_guess },
        { user: users[1], msg: guess + the_guess },
      ]);
    }).then(function() {
      return check(
        { user: users[1], msg: guess + the_guess },
        [
          { key: 'guesses', options: [users[1].nickname, the_guess], to: users[0] },
          { key: 'guesses', options: [users[1].nickname, the_guess], to: users[2] },
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
    let users = getUsers(3);

    let the_guess = 'foo';
    let msg2 = 'SILENCE OF THE LAMBS';

    return playGame(users).then(function() {
      return setup([
        { user: users[1], msg: guess + the_guess },
        { user: users[2], msg: guess + the_guess },
        { user: users[1], msg: guess + the_guess },
      ]);
    }).then(function() {
      let correct = 'jurassic park';
      return check(
        { user: users[2], msg: guess + correct },
        [
          { key: 'guesses', options: [users[2].nickname, correct], to: users[0] },
          { key: 'guesses', options: [users[2].nickname, correct], to: users[1] },
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
    let users = getUsers(3);

    let the_guess = 'foo';
    let msg2 = 'SILENCE OF THE LAMBS';

    return playGame(users).then(function() {
      return setup([
        { user: users[1], msg: guess + the_guess },
        { user: users[2], msg: guess + the_guess },
        { user: users[1], msg: guess + the_guess },
      ]);
    }).then(function() {
      return check(
        { user: users[2], msg: guess + the_guess },
        [
          { key: 'guesses', options: [users[2].nickname, the_guess], to: users[0] },
          { key: 'guesses', options: [users[2].nickname, the_guess], to: users[1] },
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

  it('should allow a game to move on if everyone loses', function() {
    let users = getUsers(3);

    let the_guess = 'foo';
    //let msg2 = 'SILENCE OF THE LAMBS';

    return playGame(users).then(function() {
      return setup([
        { user: users[1], msg: guess + the_guess },
        { user: users[2], msg: guess + the_guess },
        { user: users[2], msg: guess + the_guess },
        { user: users[1], msg: guess + the_guess },
      ]);
    }).then(function() {
      return check(
        { user: users[1], msg: submission + EMOJI },
        [
          { to: users[1], key: 'game-submission-sent'},
          { to: users[0], key: 'says', options: [users[1].nickname, EMOJI] },
          { to: users[2], key: 'says', options: [users[1].nickname, EMOJI] },
          { to: users[0], key: 'guessing-instructions' },
          { to: users[2], key: 'guessing-instructions' }
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  //it.only('should handle the bug I saw in production', function() {
    //let users = getUsers(3);

    //let msg2 = 'TIME AFTER TIME';

    //return playGame(users).then(function() {
      //return setup([
        //{ user: users[2], msg: guess + 'JURASSIC PARK' },
        //{ user: users[1], msg: EMOJI },
        //{ user: users[1], msg: EMOJI },
        //{ user: users[0], msg: guess + 'planet of the apes' },
        //{ user: users[0], msg: guess + 'space chimps' },
        //{ user: users[2], msg: clue },
        //{ user: users[2], msg: guess + '2001' },
      //]);
    //}).then(function() {
      //let the_guess = 'foo';
      //return check(
        //{ user: users[2], msg: guess + the_guess },
        //[
          //{ to: users[0], key: 'guesses', options: [users[2].nickname, the_guess] },
          //{ to: users[1], key: 'guesses', options: [users[2].nickname, the_guess] },
          //{ to: users[0], key: 'round-over', options: [users[2].nickname] },
          //{ to: users[1], key: 'round-over', options: [users[2].nickname] },
          //{ to: users[2], key: 'round-over', options: [users[2].nickname] },
          //{ to: users[0], key: 'game-next-round', options: [users[2].nickname] },
          //{ to: users[1], key: 'game-next-round', options: [users[2].nickname] },
          //{ to: users[2], key: 'game-next-round-suggestion', options: [users[2].nickname, msg2] },
        //]
      //).then(function(obj) {
        //obj.output.should.deep.equal(obj.expected);
      //});
    //});
  //});

});
