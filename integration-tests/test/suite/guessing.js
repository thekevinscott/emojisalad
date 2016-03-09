'use strict';
/*
 * Tests that guessing works
 *
 */

const getPlayers = require('lib/getPlayers');
const playGame = require('flows/playGame');
const startGame = require('flows/startGame');
const setup = require('lib/setup');
const check = require('lib/check');
const rule = require('../../config/rule');
const guess = rule('guess').example();
//const EMOJI = '😀';

describe('Guessing', () => {

  describe('Correct', () => {
    it('should be able to successfully guess', () => {
      const players = getPlayers(3);

      return playGame(players, true).then((game_phrase) => {
        //throw "This is not checking accurately, check guess.js:22"
        return check(
          { player: players[1], msg: guess + game_phrase },
          [
            { key: 'says', options: [players[1].nickname, players[1].avatar, game_phrase], to: players[0] },
            { key: 'says', options: [players[1].nickname, players[1].avatar, game_phrase], to: players[2] },
            { key: 'correct-guess', options: [players[1].nickname, players[1].avatar, '*'], to: players[0] },
            { key: 'correct-guess', options: [players[1].nickname, players[1].avatar, '*'], to: players[1] },
            { key: 'correct-guess', options: [players[1].nickname, players[1].avatar, '*'], to: players[2] },
            { key: 'game-next-round', options: [players[1].nickname, players[1].avatar], to: players[0] },
            { key: 'game-next-round-suggestion', options: [players[1].nickname, players[1].avatar, '*'], to: players[1] },
            { key: 'game-next-round', options: [players[1].nickname, players[1].avatar], to: players[2] }
          ]
        );
      });
    });

    it('should be able to successfully guess with case insensitivity', () => {
      const players = getPlayers(3);

      return playGame(players, true).then((game_phrase) => {
        const the_guess = game_phrase.toLowerCase();
        return check(
          { player: players[1], msg: guess + the_guess },
          [
            { to: players[0],key: 'says', options: [players[1].nickname, players[1].avatar, the_guess] },
            { to: players[2],key: 'says', options: [players[1].nickname, players[1].avatar, the_guess] },
            { to: players[0], key: 'correct-guess', options: [players[1].nickname, players[1].avatar, game_phrase] },
            { to: players[1], key: 'correct-guess', options: [players[1].nickname, players[1].avatar, game_phrase] },
            { to: players[2], key: 'correct-guess', options: [players[1].nickname, players[1].avatar, game_phrase] },
            { to: players[0], key: 'game-next-round', options: [players[1].nickname, players[1].avatar] },
            { to: players[1], key: 'game-next-round-suggestion', options: [players[1].nickname, players[1].avatar, '*'] },
            { to: players[2], key: 'game-next-round', options: [players[1].nickname, players[1].avatar] }
          ]
        );
      });
    });

    it('should be able to successfully guess with the maximum number of typos', () => {
      const players = getPlayers(3);

      return playGame(players, true).then((game_phrase) => {
        const the_guess = game_phrase.substring(1);
        return check(
          { player: players[1], msg: guess + the_guess },
          [
            { to: players[0],key: 'says', options: [players[1].nickname, players[1].avatar, the_guess] },
            { to: players[2],key: 'says', options: [players[1].nickname, players[1].avatar, the_guess] },
            { to: players[0], key: 'correct-guess', options: [players[1].nickname, players[1].avatar, game_phrase] },
            { to: players[1], key: 'correct-guess', options: [players[1].nickname, players[1].avatar, game_phrase] },
            { to: players[2], key: 'correct-guess', options: [players[1].nickname, players[1].avatar, game_phrase] },
            { to: players[0], key: 'game-next-round', options: [players[1].nickname, players[1].avatar] },
            { to: players[1], key: 'game-next-round-suggestion', options: [players[1].nickname, players[1].avatar, '*'] },
            { to: players[2], key: 'game-next-round', options: [players[1].nickname, players[1].avatar] }
          ]
        );
      });
    });

    it('should allow a guesser to guess before the emoji is submitted', () => {
      const players = getPlayers(3);

      return startGame(players, true).then((game_phrase) => {
        const the_guess = game_phrase;
        return check(
          { player: players[1], msg: guess + game_phrase },
          [
            { to: players[0],key: 'says', options: [players[1].nickname, players[1].avatar, the_guess] },
            { to: players[2],key: 'says', options: [players[1].nickname, players[1].avatar, the_guess] },
            { to: players[0], key: 'correct-guess', options: [players[1].nickname, players[1].avatar, game_phrase] },
            { to: players[1], key: 'correct-guess', options: [players[1].nickname, players[1].avatar, game_phrase] },
            { to: players[2], key: 'correct-guess', options: [players[1].nickname, players[1].avatar, game_phrase] },
            { to: players[0], key: 'game-next-round', options: [players[1].nickname, players[1].avatar] },
            { to: players[1], key: 'game-next-round-suggestion', options: [players[1].nickname, players[1].avatar, '*'] },
            { to: players[2], key: 'game-next-round', options: [players[1].nickname, players[1].avatar] }
          ]
        );
      });
    });

    it('should let people guess as many times as they want', () => {
      const players = getPlayers(3);

      const the_guess = 'bar';
      return playGame(players, false).then(() => {
        return setup([
          { player: players[1], msg: guess + the_guess},
          { player: players[1], msg: guess + the_guess},
          { player: players[1], msg: guess + the_guess}
        ]);
      }).then(() => {
        return check(
          { player: players[1], msg: guess + the_guess},
          [
            { to: players[0], key: 'says', options: [players[1].nickname, players[1].avatar, the_guess] },
            { to: players[2], key: 'says', options: [players[1].nickname, players[1].avatar, the_guess] }
          ]
        );
      });
    });

    it('should allow a guesser guess after a submitter guesses before submitting', () => {
      const players = getPlayers(3);

      return startGame(players, true).then((game_phrase) => {
        return setup([
          { player: players[0], msg: guess + game_phrase }
        ]).then(() => {
          return check(
            { player: players[1], msg: guess + game_phrase },
            [
              { key: 'says', options: [players[1].nickname, players[1].avatar, game_phrase], to: players[0] },
              { key: 'says', options: [players[1].nickname, players[1].avatar, game_phrase], to: players[2] },
              { key: 'correct-guess', options: [players[1].nickname, players[1].avatar, '*'], to: players[0] },
              { key: 'correct-guess', options: [players[1].nickname, players[1].avatar, '*'], to: players[1] },
              { key: 'correct-guess', options: [players[1].nickname, players[1].avatar, '*'], to: players[2] },
              { key: 'game-next-round', options: [players[1].nickname, players[1].avatar], to: players[0] },
              { key: 'game-next-round-suggestion', options: [players[1].nickname, players[1].avatar, '*'], to: players[1] },
              { key: 'game-next-round', options: [players[1].nickname, players[1].avatar], to: players[2] }
            ]
          );
        });
      });
    });
  });

  describe('Incorrect', () => {
    it('should not be notified on an incorrect guess', () => {
      const players = getPlayers(3);

      return playGame(players, false).then(() => {
        const this_guess = 'foo';
        return check(
          { player: players[1], msg: guess + this_guess},
          [
            { to: players[0], key: 'says', options: [players[1].nickname, players[1].avatar, this_guess] },
            { to: players[2], key: 'says', options: [players[1].nickname, players[1].avatar, this_guess] }
          ]
        );
      });
    });
  });
});
