'use strict';

var getPlayers = require('../lib/getPlayers');
var setup = require('../lib/setup');
var check = require('../lib/check');

describe('Signup', function() {

  describe('Test a brand new player', function() {
    it('should introduce itself when contacting for the first time', function() {
      var player = getPlayers(1)[0];
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
        var player = getPlayers(1)[0];
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
      it('should start the onboarding with a "yeehaw" response', function() {
        return reachOut().then(function(player) {
          return check(
            { player: player, msg: 'yeehaw' },
            []
          );
        }).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });
  });

  it('should prompt the player to invite friends', function() {
    var player = getPlayers(1)[0];
    return setup([
      { player: player, msg: 'hello' },
      { player: player, msg: 'y' },
    ]).then(function() {
      return check(
        { player: player, msg: player.nickname },
        [
          { key: 'intro_3', options: [ player.nickname ], to: player }
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should blacklist a new player who messages accidentally', function() {
    var player = getPlayers(1)[0];
    return setup([
      { player: player, msg: 'hello' },
      { player: player, msg: 'no' },
    ]).then(function() {
      return check(
        { player: player, msg: 'any response?' },
        [ ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should chide a player who tries to invite players before entering a nickname', function() {
    var player = getPlayers(1)[0];
    return setup([
      { player: player, msg: 'hello' },
      { player: player, msg: 'yes' },
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
