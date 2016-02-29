'use strict';
/*
 * Tests that asking for help works
 *
 */

const getPlayers = require('lib/getPlayers');
const playGame = require('flows/playGame');
const startGame = require('flows/startGame');
const setup = require('lib/setup');
const check = require('lib/check');
const rule = require('../../config/rule');
const help = rule('help').example();
const guess = rule('guess').example();
const EMOJI = '😀';

describe('Help', () => {
  describe('Submitter', () => {
    it('should give help to a submitter before they submit their clue', () => {
      const players = getPlayers(2);
      const submitter = players[0];

      return startGame(players).then(() => {
        return check(
          { player: submitter, msg: help },
          [
            {
              to: submitter,
              key: 'help-submitter-waiting-for-submission',
              options: {
                game: {
                  round: {
                    submitter: submitter
                  }
                }
              }
            },
          ]
        );
      });
    });

    it('should give help to a submitter after they submit their clue', () => {
      const players = getPlayers(2);
      const submitter = players[0];

      return startGame(players).then(() => {
        return setup([
          { player: submitter, msg: EMOJI }
        ]);
      }).then(() => {
        return check(
          { player: submitter, msg: help },
          [
            {
              to: submitter,
              key: 'help-submitter-submitted',
              options: {
                game: {
                  round: {
                    submitter: submitter
                  }
                }
              }
            },
          ]
        );
      });
    });
  });

  describe('Player', () => {
    //it('should give help to a player while they\'re on the bench', () => {
      //const players = getPlayers(3);

      //return playGame(players.slice(0, 2)).then(() => {
        //return invite(players[0], players[2]);
      //}).then(() => {
        //return check(
          //{ player: players[2], msg: help },
          //[
            //{ to: players[2], key: 'help-player-bench' },
          //]
        //);
      //});
    //});

    it('should give help to a player while they\'re waiting for emoji', () => {
      const players = getPlayers(2);

      return startGame(players).then(() => {
        return check(
          { player: players[1], msg: help },
          [
            {
              to: players[1],
              key: 'help-player-ready-for-game',
              options: {
                game: {
                  round: {
                    submitter: players[0]
                  }
                }
              }
            },
          ]
        );
      });
    });

    it('should give help to a player during a game', () => {
      const players = getPlayers(2);
      const EMOJI_CLUE = '😀';

      return playGame(players).then(() => {
        return check(
          { player: players[1], msg: help },
          [
            {
              to: players[1],
              key: 'help-player-guessing',
              options: {
                game: {
                  round: {
                    submission: EMOJI_CLUE
                  }
                }
              }
            },
          ]
        );
      });
    });

    //it('should give help to a player after a round', () => {
      //const players = getPlayers(2);

      //return playGame(players).then(() => {
        //return setup([
          //{ player: players[1], msg: guess + game.round.phrase }
        //]);
      //}).then(() => {
        //return check(
          //{ player: players[2], msg: help },
          //[
            //{ to: players[2], key: 'help-player-waiting-for-round', options: { game: game } },
          //]
        //);
      //});
    //});
  });
});
