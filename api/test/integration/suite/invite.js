'use strict';
const getUsers = require('../lib/getUsers');
const setup = require('../lib/setup');
const check = require('../lib/check');
//const getGame = require('../lib/getGame');
const signup = require('../flows/signup');
const startGame = require('../flows/startGame');
const Game = require('models/game');
const User = require('models/user');
const EMOJI = '😀';
const game_number = '12013409832';

describe('Inviting', function() {
  describe('Invalid Phone Numbers', function() {
    var users = getUsers(2);
    var inviter = users[0];

    before(function() {
      return signup(inviter);
    });

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
    var users = getUsers(2);
    var inviter = users[0];
    before(function() {
      return signup(inviter);
    });

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
        );
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
        return User.get({ number: inviter.number }).then(function(gotUser) {
          return Game.get({ user: gotUser, game_number: game_number }).then(function(game) {
            //console.log('********** 1 game', user.number, game.id, game.random);
            return Game.update(game, { random : 0 });
          });
        });
      }).then(function() {
        //console.log('********** 2 game', user.number, game.id, game.random);
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

  describe('Inviting during a game', function() {
    function runBothPlayers(users) {
      it('should let submitter invite', function() {
        var inviter = users[0];
        var invitee = getUsers(3).pop();
        return check(
          { user: inviter, msg: 'invite '+invitee.number },
          [
            { to: inviter, key: 'intro_4', options: [invitee.number] },
            { to: invitee, key: 'invite', options: [inviter.nickname] }
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });

      it('should let player invite', function() {
        var inviter = users[1];
        var invitee = getUsers(3).pop();
        console.log('should let player invite');
        return check(
          { user: inviter, msg: 'invite '+invitee.number },
          [
            { to: inviter, key: 'intro_4', options: [invitee.number] },
            { to: invitee, key: 'invite', options: [inviter.nickname] }
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    }

      // should allow for an invite after a submission (by submitter and other player)
      // should allow for an invite after a correct answer (by submitter and other player)
    describe('before a round starts', function() {
      var users = getUsers(2);
      before(function() {
        return startGame(users);
      });

      runBothPlayers(users);
    });

    describe('during a round', function() {
      var users = getUsers(2);
      before(function() {
        return startGame(users).then(function() {
          return setup([
            { user: users[0], msg: EMOJI }
          ]);
        });
      });

      runBothPlayers(users);
    });

    describe('after guessing incorrectly', function() {
      var users = getUsers(2);
      before(function() {
        return startGame(users).then(function() {
          return setup([
            { user: users[0], msg: EMOJI },
            { user: users[1], msg: 'guess foo' }
          ]);
        });
      });

      runBothPlayers(users);
    });

    describe('after guessing correctly', function() {
      var users = getUsers(2);
      before(function() {
        return startGame(users).then(function() {
          return setup([
            { user: users[0], msg: EMOJI },
            { user: users[1], msg: 'guess JURASSIC PARK' }
          ]);
        });
      });

      runBothPlayers(users);
    });

    it('should be able to onboard a third user to the game', function() {
      var users = getUsers(2);
      var invitee = getUsers(3).pop();
      console.log('start that game');
      return startGame(users).then(function() {
        return setup([
          { user: users[0], msg: 'invite '+invitee.number },
          { user: invitee, msg: 'yes' },
        ]);
      }).then(function() {
        return check(
          { user: invitee, msg: invitee.nickname },
          [
            { to: users[0], key: 'accepted-invited', options: [invitee.nickname] },
            { to: users[1], key: 'join-game', options: [invitee.nickname] },
            { to: invitee, key: 'accepted-inviter', options: [invitee.nickname, users[0].nickname] },
          ]
        );
      }).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

    it('should make a third user invited in the middle of a round wait until the next round', function() {
      var users = getUsers(2);
      var invitee = getUsers(3).pop();
      return startGame(users).then(function() {
        return setup([
          { user: users[0], msg: EMOJI },
          { user: users[0], msg: 'invite '+invitee.number },
          { user: invitee, msg: 'yes' },
        ]);
      }).then(function() {
        return check(
          { user: invitee, msg: invitee.nickname },
          [
            { to: users[0], key: 'accepted-invited-next-round', options: [invitee.nickname] },
            { to: users[1], key: 'join-game-next-round', options: [invitee.nickname] },
            { to: invitee, key: 'accepted-inviter-next-round', options: [invitee.nickname, users[0].nickname] },
          ]
        );
      }).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });
});
