'use strict';

const getPlayers = require('../lib/getPlayers');
const setup = require('../lib/setup');
const check = require('../lib/check');
const Player = require('models/player');
const rule = require('config/rule');
const EMOJI = '🐳';

describe.only('Signup', function() {

  describe('Test a brand new player', function() {
    it('should introduce itself when contacting for the first time', function() {
      let player = getPlayers(1)[0];
      return check(
        { player: player, msg: 'hello?' },
        [
          { key: 'intro', to: player }
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

    describe('Saying yes', function() {
      function reachOut() {
        let player = getPlayers(1)[0];
        return setup([
          { player: player, msg: 'hi' }
        ]).then(function() {
          return player;
        });
      }

      function sayYes(message) {
        return reachOut().then(function(player) {
          return check(
            { player: player, msg: message },
            [{ key: 'intro_2', to: player }]
          );
        });
      }

      it('should start the onboarding with a "yes" response', function() {
        return sayYes('yes').then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
      it('should start the onboarding with a case sensitive "Yes" response', function() {
        return sayYes('Yes').then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
      it('should start the onboarding with a "y" response', function() {
        return sayYes('y').then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
      it('should start the onboarding with a "yea" response', function() {
        return sayYes('yea').then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
      it('should start the onboarding with a "yeah" response', function() {
        return sayYes('yeah').then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });
  });

  it('should allow the player to submit a nickname', function() {
    let player = getPlayers(1)[0];
    return setup([
      { player: player, msg: 'hello' },
      { player: player, msg: rule('yes').example() },
    ]).then(() => {
      return check(
        { player: player, msg: player.nickname },
        [
          { key: 'intro_3', options: [ player.nickname, '*' ], to: player }
        ],
        true);
    });
  });

  it('should allow the player to accept the emoji', function() {
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
        ], true);
    });
  });

  it('should allow the player to change the emoji', () => {
    let player = getPlayers(1)[0];
    return setup([
      { player: player, msg: 'hello' },
      { player: player, msg: 'y' },
      { player: player, msg: player.nickname }
    ]).then(() => {
      return check(
        { player: player, msg: EMOJI },
        [
          { key: 'intro_4', options: [ player.nickname, EMOJI ], to: player }
        ], true);
    });
  });

  it('should disallow a player from submitting invalid emoji', function() {
    let player = getPlayers(1)[0];
    return setup([
      { player: player, msg: 'hello' },
      { player: player, msg: 'y' },
      { player: player, msg: player.nickname },
    ]).then(function() {
      return check(
        { player: player, msg: 'foo' },
        [
          { key: 'error-14', to: player }
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should disallow a player from submitting more than one emoji', function() {
    let player = getPlayers(1)[0];
    return setup([
      { player: player, msg: 'hello' },
      { player: player, msg: 'y' },
      { player: player, msg: player.nickname },
    ]).then(function() {
      return check(
        { player: player, msg: EMOJI+EMOJI },
        [
          { key: 'error-14', to: player }
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  describe('Blacklist', function() {
    function blacklistCheck(msg) {
      let player = getPlayers(1)[0];
      return setup([
        { player: player, msg: 'hello' },
        { player: player, msg: msg },
      ]).then(function() {
        return check(
          { player: player, msg: 'any response?' },
          [ ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    }
    it('should blacklist a new player who says no', function() {
      blacklistCheck('no');
    });

    it('should blacklist a new player who says fuck off', function() {
      blacklistCheck('fuck off');
    });

    it('should huh anything else', function() {
      let player = getPlayers(1)[0];
      return setup([
        { player: player, msg: 'hello' },
      ]).then(function() {
        return check(
          { player: player, msg: 'boo urns' },
          [
            { key: 'onboarding_wtf', to: player }
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });
  });

  it('should chide a player who tries to invite players before entering a nickname', function() {
    let player = getPlayers(1)[0];
    return setup([
      { player: player, msg: 'hello' },
      { player: player, msg: rule('yes').example() },
    ]).then(function() {
      return check(
        { player: player, msg: 'invite foo' },
        [{ key: 'wait-to-invite', to: player }]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should chide a player who tries to invite players before entering an avatar', function() {
    let player = getPlayers(1)[0];
    return setup([
      { player: player, msg: 'hello' },
      { player: player, msg: rule('yes').example() },
      { player: player, msg: player.nickname } ,
    ]).then(function() {
      return check(
        { player: player, msg: 'invite foo' },
        [{ key: 'wait-to-invite', to: player }]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

});
