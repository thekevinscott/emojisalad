'use strict';
const getPlayers = require('lib/getPlayers');
const setup = require('lib/setup');
const check = require('lib/check');
const signup = require('flows/signup');
const startGame = require('flows/startGame');
const rule = require('config/rule');
const EMOJI = '😀';

describe('Inviting', () => {
  describe('Valid numbers', () => {
    const players = getPlayers(2);
    const inviter = players[0];
    before(() => {
      return signup(inviter);
    });

    it('should be able to invite someone', () => {
      const player = getPlayers(1)[0];

      return check(
        // lose the intro of the number for testing
        { player: inviter, msg: 'invite '+player.number },
        [
          { key: 'intro_5', options: [player.number], to: inviter },
          { key: 'invite', options: [inviter.nickname, inviter.avatar, player.number], to: player }
        ]);
    });

    it('should be able to invite a formatted number', () => {

      //const end = Math.floor(1000 + Math.random() * 9000);
      //const num = '+1860460'+end;
      const num = '+18604608183';

      const player = getPlayers(1)[0];
      player.from = num;

      return check(
        { player: inviter, msg: 'invite '+player.from },
        [
          { key: 'intro_5', options: [player.from], to: inviter },
          { key: 'invite', options: [inviter.nickname, inviter.avatar, player.avatar], to: player }
        ]);
    });

    it('should not be able to re-invite someone', () => {
      const player = getPlayers(1)[0];

      return setup([
        { player: inviter, msg: 'invite '+player.number }
      ]).then(() => {
        return check(
          { player: inviter, msg: 'invite '+player.number },
          [
            { key: 'error-2', options: [player.number], to: inviter }
          ]
        );
      });
    });

    it('should not be able to invite someone on do-not-call-list', () => {
      const player = getPlayers(1)[0];

      return setup([
        { player: inviter, msg: 'invite '+player.number },
        { player, msg: rule('no').example() }
      ]).then(() => {
        return check(
          { player: inviter, msg: 'invite '+player.number },
          [
            { key: 'error-3', options: [player.number], to: inviter }
          ]
        );
      });
    });

    it('should be able to onboard an invited player', () => {
      // get a kevin user, to make it easier
      // to parse who is who
      const player = getPlayers(2)[1];

      return setup([
        { player: inviter, msg: 'invite '+player.number },
        { player, msg: 'yes' },
        { player, msg: player.nickname }
      ]).then(() => {
        return check(
          { player, msg: player.avatar },
          [
            { key: 'accepted-invited', options: [player.nickname, player.avatar], to: inviter },
            { key: 'accepted-inviter', options: [player.nickname, player.avatar, inviter.nickname, inviter.avatar], to: player },
            { key: 'game-start', options: [inviter.nickname, inviter.avatar, '*'], to: inviter }
          ]
        );
      });
    });

    it('should be able to invite someone without the word invite', () => {
      const player = getPlayers(2)[1];

      return check(
        { player: inviter, msg: player.number },
        [
          { key: 'intro_5', options: [player.from], to: inviter },
          { key: 'invite', options: [inviter.nickname, inviter.avatar, player.avatar], to: player }
        ]
      );
    });

    describe.only('More complicated edge cases', () => {
      it('should let a second user inviting the same user know they\'ve been invited already', () => {
        const players = getPlayers(3);
        return startGame(players.slice(0,2)).then(() => {
          return setup([
            { player: players[0], msg: 'invite '+players[2].number }
          ]);
        }).then(() => {
          return check(
            { player: players[1], msg: 'invite '+players[2].number },
            [
              { key: 'error-2', options: [players[2].number], to: players[1] }
            ]
          );
        });
      });

      it('should disallow inviting a user already in the game', () => {
        const players = getPlayers(2);
        return startGame(players).then(() => {
          return check(
            { player: players[1], msg: 'invite '+players[2].number },
            [
              { key: 'error-2', options: [players[2].number], to: players[1] }
            ]
          );
        });
      });

      it('should disallow inviting yourself', () => {
      });

      it('should handle invalid numbers such as 555-555-5555', () => {
      });

      it('should handle invalid numbers such as 555', () => {
      });
    });

    // TODO: Figure out a good way to test this without
    // actual tight integration with Twilio's servers
    //it('should preformat incoming numbers; ari invited 8604608183, but +18604608183 is a new user', () => {

      //const player = getPlayers(1)[0];

      //return check(
        //{ player: inviter, msg: 'invite '+player.number.substring(2) },
        //[
          //{ key: 'intro_5', options: [player.number.substring(2)], to: inviter },
          //{ key: 'invite', options: [inviter.nickname, inviter.avatar, player.avatar], to: player }
        //]);
    //});

  });

  describe('during a game', () => {
    it('responds to a user who writes after inviting', () => {
      const players = getPlayers(2);
      return signup(players[0]).then(() => {
        return setup([
          { player: players[0], msg: 'invite '+players[1].number }
        ]);
      }).then(() => {
        return check(
          { player: players[0], msg: 'sup big foot' },
          [
            { key: 'invited-chilling', to: players[0] }
          ]
        );
      });
    });


    const runBothPlayers = (players) => {
      it('should let submitter invite', () => {
        const inviter = players[0];
        const invitee = getPlayers(3).pop();
        return check(
          { player: inviter, msg: 'invite '+invitee.number },
          [
            { to: inviter, key: 'intro_5', options: [invitee.number] },
            { to: invitee, key: 'invite', options: [inviter.nickname, inviter.avatar] }
          ]
        );
      });

      it('should let player invite', () => {
        const inviter = players[1];
        const invitee = getPlayers(3).pop();
        return check(
          { player: inviter, msg: 'invite '+invitee.number },
          [
            { to: inviter, key: 'intro_5', options: [invitee.number] },
            { to: invitee, key: 'invite', options: [inviter.nickname, inviter.avatar, inviter.number] }
          ]
        );
      });
    };

    // should allow for an invite after a submission (by submitter and other player)
    // should allow for an invite after a correct answer (by submitter and other player)
    describe('before a round starts', () => {
      const players = getPlayers(2);
      before(() => {
        return startGame(players);
      });

      runBothPlayers(players);
    });

    describe('during a round', () => {
      const players = getPlayers(2);
      before(() => {
        return startGame(players).then(() => {
          return setup([
            { player: players[0], msg: EMOJI }
          ]);
        });
      });

      runBothPlayers(players);
    });

    describe('after guessing incorrectly', () => {
      const players = getPlayers(2);
      before(() => {
        return startGame(players).then(() => {
          return setup([
            { player: players[0], msg: EMOJI },
            { player: players[1], msg: 'guess foo' }
          ]);
        });
      });

      runBothPlayers(players);
    });

    describe('after guessing correctly', () => {
      const players = getPlayers(2);
      before(() => {
        return startGame(players).then(() => {
          return setup([
            { player: players[0], msg: EMOJI },
            { player: players[1], msg: 'guess JURASSIC PARK' }
          ]);
        });
      });

      runBothPlayers(players);
    });

    it('should be able to onboard a third player to the game', () => {
      const players = getPlayers(2);
      const invitee = getPlayers(3).pop();
      return startGame(players).then(() => {
        return setup([
          { player: players[0], msg: 'invite '+invitee.number },
          { player: invitee, msg: 'yes' },
          { player: invitee, msg: invitee.nickname }
        ]);
      }).then(() => {
        return check(
          { player: invitee, msg: invitee.avatar },
          [
            { to: players[0], key: 'accepted-invited', options: [invitee.nickname, invitee.avatar] },
            { to: players[1], key: 'join-game', options: [invitee.nickname, invitee.avatar] },
            { to: invitee, key: 'accepted-inviter', options: [invitee.nickname, invitee.avatar, players[0].nickname, players[0].avatar] }
          ]
        );
      });
    });
  });
});
