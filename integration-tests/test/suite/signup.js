'use strict';

const getPlayers = require('lib/getPlayers');
const setup = require('lib/setup');
const check = require('lib/check');
const rule = require('config/rule');
const EMOJI = '🐳';

describe('Signup', () => {

  describe('Test a brand new player', () => {
    it('should introduce itself when contacting for the first time', () => {
      let player = getPlayers(1)[0];
      return check(
        { player: player, msg: 'hello?' },
        [
          { key: 'intro', to: player }
        ]);
    });

    describe('Saying yes', () => {
      const reachOut = () => {
        let player = getPlayers(1)[0];
        return setup([
          { player: player, msg: 'hi' }
        ]).then(() => {
          return player;
        });
      }

      const sayYes = (message) => {
        return reachOut().then((player) => {
          return check(
            { player: player, msg: message },
            [{ key: 'intro_2', to: player }]
          );
        });
      }

      it('should start the onboarding with a "yes" response', () => {
        return sayYes('yes');
      });
      it('should start the onboarding with a case sensitive "Yes" response', () => {
        return sayYes('Yes');
      });
      it('should start the onboarding with a "y" response', () => {
        return sayYes('y');
      });
      it('should start the onboarding with a "yea" response', () => {
        return sayYes('yea');
      });
      it('should start the onboarding with a "yeah" response', () => {
        return sayYes('yeah');
      });
    });
  });

  describe('Nicknames and avatars', () => {
    it('should allow the player to submit a nickname', () => {
      let player = getPlayers(1)[0];
      return setup([
        { player: player, msg: 'hello' },
        { player: player, msg: rule('yes').example() },
      ]).then(() => {
        return check(
          { player: player, msg: player.nickname },
          [
            { key: 'intro_3', options: [ player.nickname, '*' ], to: player }
          ]);
      });
    });

    it('should allow the player to accept the emoji', () => {
      let player = getPlayers(1)[0];
      return setup([
        { player: player, msg: 'hello' },
        { player: player, msg: rule('yes').example() },
        { player: player, msg: player.nickname }
      ]).then(() => {
        return check(
          { player: player, msg: rule('keep').example() },
          [
            { key: 'intro_4', options: [ player.nickname, '*' ], to: player }
          ]);
      });
    });

    it('should allow the player to change the emoji', () => {
      let player = getPlayers(1)[0];
      return setup([
        { player: player, msg: 'hello' },
        { player: player, msg: 'y' },
        { player: player, msg: player.nickname }
      ]).then(() => {
        //console.log('the options', [ player.nickname, EMOJI ] );
        return check(
          { player: player, msg: EMOJI },
          [
            { key: 'intro_4', options: [ player.nickname, EMOJI ], to: player }
          ]);
      });
    });

    it('should disallow a player from submitting invalid emoji', () => {
      let player = getPlayers(1)[0];
      return setup([
        { player: player, msg: 'hello' },
        { player: player, msg: 'y' },
        { player: player, msg: player.nickname },
      ]).then(() => {
        return check(
          { player: player, msg: 'foo' },
          [
            { key: 'error-14', to: player }
          ]
        );
      });
    });

    it('should disallow a player from submitting more than one emoji', () => {
      let player = getPlayers(1)[0];
      return setup([
        { player: player, msg: 'hello' },
        { player: player, msg: 'y' },
        { player: player, msg: player.nickname },
      ]).then(() => {
        return check(
          { player: player, msg: EMOJI+EMOJI },
          [
            { key: 'error-14', to: player }
          ]
        );
      });
    });

    describe('Blacklist', () => {
      const blacklistCheck = (msg) => {
        const player = getPlayers(1)[0];
        return setup([
          { player: player, msg: 'hello' },
          { player: player, msg: msg },
        ]).then(() => {
          return check(
            { player: player, msg: 'any response?' },
            [ ]
          );
        });
      };

      it('should blacklist a new player who says no', () => {
        return blacklistCheck('no');
      });

      it('should blacklist a new player who says fuck off', () => {
        return blacklistCheck('fuck off');
      });

      it('should huh anything else', () => {
        const player = getPlayers(1)[0];
        return setup([
          { player: player, msg: 'hello' },
        ]).then(() => {
          return check(
            { player: player, msg: 'boo urns' },
            [
              { key: 'onboarding_wtf', to: player }
            ]
          );
        });
      });
    });

    it('should chide a player who tries to invite players before entering an avatar', () => {
      let player = getPlayers(1)[0];
      return setup([
        { player: player, msg: 'hello' },
        { player: player, msg: rule('yes').example() },
        { player: player, msg: player.nickname } ,
      ]).then(() => {
        return check(
          { player: player, msg: 'invite foo' },
          [{ key: 'error-14', to: player }]
        );
      });
    });

  });
});
