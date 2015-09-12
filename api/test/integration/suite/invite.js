var expect = require('chai').expect;

var getUsers = require('../lib/getUsers');
var setup = require('../lib/setup');
var check = require('../lib/check');
var signup = require('../flows/signup');
var Game = require('../../../models/game');

describe('Inviting', function() {
  var users = getUsers(2);
  var inviter = users[0];
  before(function() {
    return signup(inviter);
  });

  describe('Invalid Phone Numbers', function() {
    it('should reject an invalid invite phrase', function() {
      return check(
        { user: inviter, msg: 'foobar' },
        [{ key: 'error-8', to: inviter }]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

    it('should reject a nothing string', function() {
      return check(
        { user: inviter, msg: 'invite' },
        [{ key: 'error-8', to: inviter }]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

    it('should reject a nothing string, this time with white space', function() {
      return check(
        { user: inviter, msg: 'invite ' },
        [{ key: 'error-8', to: inviter }]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

    it('should reject a string as number', function() {
      return check(
        { user: inviter, msg: 'invite foo' },
        [{ key: 'error-1', options: ['foo'], to: inviter }]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

    it('should reject a short number', function() {
      return check(
        { user: inviter, msg: 'invite 860460' },
        [{ key: 'error-1', options: ['860460'], to: inviter }]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  describe('Valid numbers', function() {
    this.timeout(10000);
    it('should be able to invite someone', function() {
      var user = getUsers(1)[0];

      return check(
        // lose the intro of the number for testing
        { user: inviter, msg: 'invite '+user.number.substring(2) },
        [
          { key: 'intro_4', options: [user.number], to: inviter },
          { key: 'invite', options: [inviter.nickname], to: user }
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

    it('should be able to invite a formatted number', function() {

      var end = Math.floor(1000 + Math.random() * 9000);
      var num = '+1860460'+end;

      var user = getUsers(1)[0];
      user.number = num;

      return check(
        { user: inviter, msg: 'invite '+user.number },
        [
          { key: 'intro_4', options: [user.number], to: inviter },
          { key: 'invite', options: [inviter.nickname], to: user }
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

    it('should not be able to re-invite someone', function() {
      var user = getUsers(1)[0];

      return setup([
        { user: inviter, msg: 'invite '+user.number }
      ]).then(function() {
        return check(
          { user: inviter, msg: 'invite '+user.number },
          [
            { key: 'error-2', options: [user.number], to: inviter },
          ]
        )
      }).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

    it('should not be able to invite someone on do-not-call-list', function() {
      var user = getUsers(1)[0];

      return setup([
        { user: inviter, msg: 'invite '+user.number },
        { user: user, msg: 'do not invite me again' }
      ]).then(function() {
        return check(
          { user: inviter, msg: 'invite '+user.number },
          [
            { key: 'error-3', options: [user.number], to: inviter },
          ]
        );
      }).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

    it('should be able to onboard an invited user', function() {
      var user = getUsers(1)[0];

      var firstPhrase = 'JURASSIC PARK';

      return setup([
        { user: inviter, msg: 'invite '+user.number },
        { user: user, msg: 'yes' },
      ]).then(function() {
        return Game.get(inviter).then(function(game) {
          return Game.update(game, { random : 0 });
        });
      }).then(function(game) {
        return check(
          { user: user, msg: user.nickname },
          [
            { key: 'accepted-invited', options: [user.nickname], to: inviter },
            { key: 'accepted-inviter', options: [user.nickname, inviter.nickname], to: user },
            { key: 'game-start', options: [inviter.nickname, firstPhrase], to: inviter },
          ]
        );
      }).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });
});
