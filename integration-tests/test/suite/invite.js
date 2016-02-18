'use strict';
const getPlayers = require('lib/getPlayers');
const setup = require('lib/setup');
const check = require('lib/check');
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
    it('should be able to invite someone', () => {
      let player = getPlayers(1)[0];

      return check(
        // lose the intro of the number for testing
        { player: inviter, msg: 'invite '+player.number },
        [
          { key: 'intro_5', options: [player.number], to: inviter },
          { key: 'invite', options: [inviter.nickname, player.number], to: player }
        ]);
    });

    it('should be able to invite a formatted number', () => {

      let end = Math.floor(1000 + Math.random() * 9000);
      let num = '+1860460'+end;

      let player = getPlayers(1)[0];
      player.number = num;

      return check(
        { player: inviter, msg: 'invite '+player.number },
        [
          { key: 'intro_5', options: [player.number], to: inviter },
          { key: 'invite', options: [inviter.nickname, player.avatar], to: player }
        ]);
    });

    it('should not be able to re-invite someone', () => {
      let player = getPlayers(1)[0];

      return setup([
        { player: inviter, msg: 'invite '+player.number }
      ]).then(() => {
        return check(
          { player: inviter, msg: 'invite '+player.number },
          [
            { key: 'error-2', options: [player.number], to: inviter },
          ]
        );
      });
    });

    it('should not be able to invite someone on do-not-call-list', () => {
      let player = getPlayers(1)[0];

      return setup([
        { player: inviter, msg: 'invite '+player.number },
        { player: player, msg: rule('no').example() }
      ]).then(() => {
        return check(
          { player: inviter, msg: 'invite '+player.number },
          [
            { key: 'error-3', options: [player.number], to: inviter },
          ]
        );
      });
    });

    it('should be able to onboard an invited player', () => {
      // get a kevin user, to make it easier
      // to parse who is who
      const player = getPlayers(2)[1];
      const firstPhrase = 'JURASSIC PARK';

      return setup([
        { player: inviter, msg: 'invite '+player.number },
        { player: player, msg: 'yes' },
        { player: player, msg: player.nickname },
      ]).then(() => {
        return check(
          { player: player, msg: player.avatar },
          [
            { key: 'accepted-invited', options: [player.nickname, player.avatar], to: inviter },
            { key: 'accepted-inviter', options: [player.nickname, player.avatar, inviter.nickname, inviter.avatar], to: player },
            { key: 'game-start', options: [inviter.nickname, inviter.avatar, firstPhrase], to: inviter },
          ]
        );
      });
    });
  });

  describe('Inviting during a game', function() {
    const runBothPlayers = (players) => {
      it('should let submitter invite', () => {
        let inviter = players[0];
        let invitee = getPlayers(3).pop();
        return check(
          { player: inviter, msg: 'invite '+invitee.number },
          [
            { to: inviter, key: 'intro_5', options: [invitee.number] },
            { to: invitee, key: 'invite', options: [inviter.nickname] }
          ]
        );
      });

      it('should let player invite', () => {
        let inviter = players[1];
        let invitee = getPlayers(3).pop();
        return check(
          { player: inviter, msg: 'invite '+invitee.number },
          [
            { to: inviter, key: 'intro_5', options: [invitee.number] },
            { to: invitee, key: 'invite', options: [inviter.nickname, inviter.number] }
          ]
        );
      });
    }

    // should allow for an invite after a submission (by submitter and other player)
    // should allow for an invite after a correct answer (by submitter and other player)
    describe('before a round starts', () => {
      let players = getPlayers(2);
      before(() => {
        return startGame(players);
      });

      runBothPlayers(players);
    });

    describe('during a round', () => {
      let players = getPlayers(2);
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
      let players = getPlayers(2);
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
      let players = getPlayers(2);
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
      let players = getPlayers(2);
      let invitee = getPlayers(3).pop();
      return startGame(players).then(() => {
        return setup([
          { player: players[0], msg: 'invite '+invitee.number },
          { player: invitee, msg: 'yes' },
          { player: invitee, msg: invitee.nickname },
        ]);
      }).then(() => {
        return check(
          { player: invitee, msg: invitee.avatar },
          [
            { to: players[0], key: 'accepted-invited', options: [invitee.nickname] },
            { to: players[1], key: 'join-game', options: [invitee.nickname] },
            { to: invitee, key: 'accepted-inviter', options: [invitee.nickname, players[0].nickname] },
          ]
        );
      });
    });
  });
});
