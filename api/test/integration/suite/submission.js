'use strict';
/*
 * Tests that games work with two players
 *
 */

const getUsers = require('../lib/getUsers');
const startGame = require('../flows/startGame');
const check = require('../lib/check');
const EMOJI = '😀';

describe('Submissions', function() {
  it('should forward a text submission', function() {
    var users = getUsers(3);

    return startGame(users).then(function() {
      let msg = 'foo';
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

  it('should forward a mixed text emoji submission and hint the submitter on how to send a submission', function() {
    var users = getUsers(3);

    return startGame(users).then(function() {
      let msg = EMOJI + 'foo' + EMOJI ;
      return check(
        { user: users[0], msg: msg},
        [
          { to: users[1], key: 'says', options: [users[0].nickname, msg] },
          { to: users[2], key: 'says', options: [users[0].nickname, msg] },
          { to: users[0], key: 'mixed-emoji', options: [users[0].nickname] },
        ]
      ).then(function(obj) {
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
  });
});
