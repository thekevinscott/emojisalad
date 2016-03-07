'use strict';
/*
 * Tests that passing during a round works
 *
 */

const getPlayers = require('lib/getPlayers');
const startGame = require('flows/startGame');
const playGame = require('flows/playGame');
const check = require('lib/check');
//const setup = require('lib/setup');
const rule = require('../../config/rule');
//const clue = rule('clue').example();
const pass = rule('pass').example();
//const guess = rule('guess').example();
//const EMOJI = '😀';

describe('Pass', () => {
  it('should let a submitter pass before submitting emoji', () => {
    const players = getPlayers(3);

    return startGame(players).then(() => {
      return check(
        { player: players[0], msg: pass },
        [
          { key: 'says', options: [players[0].nickname, players[0].avatar, pass], to: players[1] },
          { key: 'says', options: [players[0].nickname, players[0].avatar, pass], to: players[2] },
          { key: 'pass', options: [players[0].nickname, players[0].avatar], to: players[0] },
          { key: 'pass', options: [players[0].nickname, players[0].avatar], to: players[1] },
          { key: 'pass', options: [players[0].nickname, players[0].avatar], to: players[2] },
          { key: 'game-next-round', options: [players[1].nickname, players[1].avatar], to: players[0] },
          { key: 'game-next-round-suggestion', options: [players[1].nickname, players[1].avatar, '*'], to: players[1] },
          { key: 'game-next-round', options: [players[1].nickname, players[1].avatar], to: players[2] }
        ]
      );
    });
  });

  it('should let a submitter pass after submitting emoji', () => {
    const players = getPlayers(3);

    return playGame(players).then(() => {
      return check(
        { player: players[0], msg: pass },
        [
          { key: 'says', options: [players[0].nickname, players[0].avatar, pass], to: players[1] },
          { key: 'says', options: [players[0].nickname, players[0].avatar, pass], to: players[2] },
          { key: 'pass', options: [players[0].nickname, players[0].avatar], to: players[0] },
          { key: 'pass', options: [players[0].nickname, players[0].avatar], to: players[1] },
          { key: 'pass', options: [players[0].nickname, players[0].avatar], to: players[2] },
          { key: 'game-next-round', options: [players[1].nickname, players[1].avatar], to: players[0] },
          { key: 'game-next-round-suggestion', options: [players[1].nickname, players[1].avatar, '*'], to: players[1] },
          { key: 'game-next-round', options: [players[1].nickname, players[1].avatar], to: players[2] }
        ]
      );
    });
  });

  it('should not let a guesser pass before submitting emoji', () => {
    const players = getPlayers(3);

    return startGame(players).then(() => {
      return check(
        { player: players[1], msg: pass },
        [
          { key: 'says', options: [players[1].nickname, players[1].avatar, pass], to: players[0] },
          { key: 'says', options: [players[1].nickname, players[1].avatar, pass], to: players[2] }
        ]
      );
    });
  });

  it('should not let a guesser pass after emoji has been submitted', () => {
    const players = getPlayers(3);

    return playGame(players).then(() => {
      return check(
        { player: players[1], msg: pass },
        [
          { key: 'says', options: [players[1].nickname, players[1].avatar, pass], to: players[0] },
          { key: 'says', options: [players[1].nickname, players[1].avatar, pass], to: players[2] }
        ]
      );
    });
  });
});
