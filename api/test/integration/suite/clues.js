'use strict';
/*
 * Tests that clues work
 *
 */

const getUsers = require('../lib/getUsers');
const playGame = require('../flows/playGame');
const setup = require('../lib/setup');
const check = require('../lib/check');
const rule = require('../../../config/rule');
const clue = rule('clue').example();

describe('Clues', function() {

  it('should notify all the other users when somebody asks for a clue', function() {
    var users = getUsers(3);

    return playGame(users).then(function() {
      return check(
        { user: users[1], msg: clue },
        [
          { key: 'says', options: [users[1].nickname, clue], to: users[0] },
          { key: 'says', options: [users[1].nickname, clue], to: users[2] },
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
        { user: users[0], msg: clue },
        [
          { key: 'says', options: [users[0].nickname, clue], to: users[1] },
          { key: 'says', options: [users[0].nickname, clue], to: users[2] },
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
        { user: users[1], msg: clue }
      ]);
    }).then(function() {
      return check(
        { user: users[1], msg: clue },
        [
          { key: 'says', options: [users[1].nickname, clue], to: users[0] },
          { key: 'says', options: [users[1].nickname, clue], to: users[2] },
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
        { user: users[1], msg: clue },
        { user: users[1], msg: clue },
        { user: users[1], msg: clue },
      ]);
    }).then(function() {
      return check(
        { user: users[1], msg: clue },
        [
          { key: 'says', options: [users[1].nickname, clue], to: users[0] },
          { key: 'says', options: [users[1].nickname, clue], to: users[2] },
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
