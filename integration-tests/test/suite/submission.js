'use strict';
/*
 * Tests that games work with two players
 *
 */

const getPlayers = require('lib/getPlayers');
const startGame = require('flows/startGame');
const check = require('lib/check');
const EMOJI = '😀';

describe('Submissions', () => {
  it('should forward a text submission', () => {
    const players = getPlayers(3);

    return startGame(players).then(() => {
      const msg = 'foo';
      return check(
        { player: players[0], msg },
        [
          { to: players[1], key: 'says', options: [players[0].nickname, players[0].avatar, msg] },
          { to: players[2], key: 'says', options: [players[0].nickname, players[0].avatar, msg] }
        ]
      );
    });
  });

  /*
  it('should forward a mixed text emoji submission and hint the submitter on how to send a submission', function() {
    let players = getPlayers(3);

    return startGame(players).then(function() {
      let msg = EMOJI + 'foo' + EMOJI ;
      return check(
        { player: players[0], msg: msg},
        [
          { to: players[1], key: 'says', options: [players[0].nickname, players[0].avatar, msg] },
          { to: players[2], key: 'says', options: [players[0].nickname, players[0].avatar, msg] },
          { to: players[0], key: 'mixed-emoji', options: [players[0].nickname] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });
  */

  it('should forward the submission to other players', () => {
    const players = getPlayers(3);

    return startGame(players).then(() => {
      return check(
        { player: players[0], msg: EMOJI },
        [
          { key: 'game-submission-sent', to: players[0] },
          { key: 'emojis', options: [players[0].nickname, players[0].avatar, EMOJI], to: players[1] },
          { key: 'emojis', options: [players[0].nickname, players[0].avatar, EMOJI], to: players[2] },
          { key: 'guessing-instructions', to: players[1] },
          { key: 'guessing-instructions', to: players[2] }
        ]
      );
    });
  });

  it('should forward a mixed emoji submission to other players', () => {
    const players = getPlayers(3);

    return startGame(players).then(() => {
      const msg = EMOJI + 'foo' + EMOJI;
      return check(
        { player: players[0], msg },
        [
          { key: 'game-submission-sent', to: players[0] },
          { key: 'emojis', options: [players[0].nickname, players[0].avatar, msg ], to: players[1] },
          { key: 'emojis', options: [players[0].nickname, players[0].avatar, msg ], to: players[2] },
          { key: 'guessing-instructions', to: players[1] },
          { key: 'guessing-instructions', to: players[2] }
        ]
      );
    });
  });
});
