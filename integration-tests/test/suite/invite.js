'use strict';
const getPlayers = require('lib/getPlayers');
const setup = require('lib/setup');
const check = require('lib/check');
//const getGame = require('lib/getGame');
const signup = require('flows/signup');
const startGame = require('flows/startGame');
const rule = require('config/rule');
const EMOJI = '😀';

describe('Inviting', function() {
  /*
  describe('Invalid Phone Numbers', function() {
    let players = getPlayers(2);
    let inviter = players[0];

    before(function() {
      return signup(inviter);
    });

    it('should reject an invalid invite phrase', function() {
      return check(
        { player: inviter, msg: 'foobar' },
        [{ key: 'error-8', to: inviter }]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

    it('should reject a nothing string', function() {
      return check(
        { player: inviter, msg: 'invite' },
        [{ key: 'error-8', to: inviter }]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

    it('should reject a nothing string, this time with white space', function() {
      return check(
        { player: inviter, msg: 'invite ' },
        [{ key: 'error-8', to: inviter }]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

    it('should reject a string as number', function() {
      return check(
        { player: inviter, msg: 'invite foo' },
        [{ key: 'error-1', options: ['foo'], to: inviter }]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

    it('should reject a short number', function() {
      return check(
        { player: inviter, msg: 'invite 860460' },
        [{ key: 'error-1', options: ['860460'], to: inviter }]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });
  */

  describe('Valid numbers', function() {
    let players = getPlayers(2);
    let inviter = players[0];
    before(function() {
      return signup(inviter);
    });

    this.timeout(10000);
    it.only('should be able to invite someone', () => {
      let player = getPlayers(1)[0];

      return check(
        // lose the intro of the number for testing
        { player: inviter, msg: 'invite '+player.number },
        [
          { key: 'intro_5', options: [player.number], to: inviter },
          { key: 'invite', options: [inviter.nickname, player.number], to: player }
        ], true);
    });

    it('should be able to invite a formatted number', function() {

      let end = Math.floor(1000 + Math.random() * 9000);
      let num = '+1860460'+end;

      let player = getPlayers(1)[0];
      player.number = num;

      return check(
        { player: inviter, msg: 'invite '+player.number },
        [
          { key: 'intro_5', options: [player.number], to: inviter },
          { key: 'invite', options: [inviter.nickname, player.number], to: player }
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

    it('should not be able to re-invite someone', function() {
      let player = getPlayers(1)[0];

      return setup([
        { player: inviter, msg: 'invite '+player.number }
      ]).then(function() {
        return check(
          { player: inviter, msg: 'invite '+player.number },
          [
            { key: 'error-2', options: [player.number], to: inviter },
          ]
        );
      }).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

    it('should not be able to invite someone on do-not-call-list', function() {
      let player = getPlayers(1)[0];

      return setup([
        { player: inviter, msg: 'invite '+player.number },
        { player: player, msg: rule('no').example() }
      ]).then(function() {
        return check(
          { player: inviter, msg: 'invite '+player.number },
          [
            { key: 'error-3', options: [player.number], to: inviter },
          ]
        );
      }).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

    it('should be able to onboard an invited player', function() {
      // get a kevin user, to make it easier
      // to parse who is who
      let player = getPlayers(2)[1];

      let firstPhrase = 'JURASSIC PARK';

      return setup([
        { player: inviter, msg: 'invite '+player.number },
        { player: player, msg: 'yes' },
        { player: player, msg: player.nickname },
      ]).then(function() {
        return Player.get({ from: inviter.number}).then(function(gotPlayer) {
          return Game.get({ player: gotPlayer }).then(function(game) {
            return Game.update(game, { random : 0 });
          });
        });
      }).then(function() {
        return check(
          { player: player, msg: player.avatar },
          [
            { key: 'accepted-invited', options: [player.nickname], to: inviter },
            { key: 'accepted-inviter', options: [player.nickname, inviter.nickname], to: player },
            { key: 'game-start', options: [inviter.nickname, firstPhrase], to: inviter },
          ]
        );
      }).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  describe('Inviting during a game', function() {
    function runBothPlayers(players) {
      it('should let submitter invite', function() {
        let inviter = players[0];
        let invitee = getPlayers(3).pop();
        return check(
          { player: inviter, msg: 'invite '+invitee.number },
          [
            { to: inviter, key: 'intro_5', options: [invitee.number] },
            { to: invitee, key: 'invite', options: [inviter.nickname] }
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });

      it('should let player invite', function() {
        let inviter = players[1];
        let invitee = getPlayers(3).pop();
        return check(
          { player: inviter, msg: 'invite '+invitee.number },
          [
            { to: inviter, key: 'intro_5', options: [invitee.number] },
            { to: invitee, key: 'invite', options: [inviter.nickname, inviter.number] }
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    }

      // should allow for an invite after a submission (by submitter and other player)
      // should allow for an invite after a correct answer (by submitter and other player)
    describe('before a round starts', function() {
      let players = getPlayers(2);
      before(function() {
        return startGame(players);
      });

      runBothPlayers(players);
    });

    describe('during a round', function() {
      let players = getPlayers(2);
      before(function() {
        return startGame(players).then(function() {
          return setup([
            { player: players[0], msg: EMOJI }
          ]);
        });
      });

      runBothPlayers(players);
    });

    describe('after guessing incorrectly', function() {
      let players = getPlayers(2);
      before(function() {
        return startGame(players).then(function() {
          return setup([
            { player: players[0], msg: EMOJI },
            { player: players[1], msg: 'guess foo' }
          ]);
        });
      });

      runBothPlayers(players);
    });

    describe('after guessing correctly', function() {
      let players = getPlayers(2);
      before(function() {
        return startGame(players).then(function() {
          return setup([
            { player: players[0], msg: EMOJI },
            { player: players[1], msg: 'guess JURASSIC PARK' }
          ]);
        });
      });

      runBothPlayers(players);
    });

    it('should be able to onboard a third player to the game', function() {
      let players = getPlayers(2);
      let invitee = getPlayers(3).pop();
      return startGame(players).then(function() {
        return setup([
          { player: players[0], msg: 'invite '+invitee.number },
          { player: invitee, msg: 'yes' },
          { player: invitee, msg: invitee.nickname },
        ]);
      }).then(function() {
        return check(
          { player: invitee, msg: invitee.avatar },
          [
            { to: players[0], key: 'accepted-invited', options: [invitee.nickname] },
            { to: players[1], key: 'join-game', options: [invitee.nickname] },
            { to: invitee, key: 'accepted-inviter', options: [invitee.nickname, players[0].nickname] },
          ]
        );
      }).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

    it('should make a third player invited in the middle of a round wait until the next round', function() {
      let players = getPlayers(2);
      let invitee = getPlayers(3).pop();
      return startGame(players).then(function() {
        return setup([
          { player: players[0], msg: EMOJI },
          { player: players[0], msg: 'invite '+invitee.number },
          { player: invitee, msg: 'yes' },
          { player: invitee, msg: invitee.nickname },
        ]);
      }).then(function() {
        return check(
          { player: invitee, msg: invitee.avatar },
          [
            { to: players[0], key: 'accepted-invited-next-round', options: [invitee.nickname] },
            { to: players[1], key: 'join-game-next-round', options: [invitee.nickname] },
            { to: invitee, key: 'accepted-inviter-next-round', options: [invitee.nickname, players[0].nickname] },
          ]
        );
      }).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should mark an invite as used after using it', function() {
    let players = getPlayers(2);
    return signup(players[0]).then(function() {
      return setup([
        { player: players[0], msg: 'invite '+players[1].number },
        { player: players[1], msg: 'yes' },
      ]);
    }).then(function() {
      return Player.get(players[1]);
    }).then(function(player) {
      return Invite.getInvite(player);
    }).then(function(invite) {
      invite.used.should.equal(1);
    });
  });
});
