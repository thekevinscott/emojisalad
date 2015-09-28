'use strict';
/*
 * Tests that games work with two players
 *
 */

const getUsers = require('../lib/getUsers');
const startGame = require('../flows/startGame');
const check = require('../lib/check');
const rule = require('../../../config/rule');
const EMOJI = '😀';
const submission = rule('submission').example();

describe('Submissions', function() {
  it('should forward submissions not prefaced by /submission', function() {
    var users = getUsers(3);

    return startGame(users).then(function() {
      var msg = 'foo';
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

  it('should get pissy if you try and send a text submission', function() {
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
        { user: users[0], msg: submission + EMOJI },
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
  });
});
