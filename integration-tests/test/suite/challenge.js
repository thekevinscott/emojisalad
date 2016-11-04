'use strict';
/*
 * Tests that people texting in to new numbers
 * are able to guess at challenges.
 *
 * Folks can:
 *
 * - text an answer, and it's correct! Drop them immediately into onboarding flow
 * - text an answer, and it's incorrect. Drop them into challenge flow.
 * - text a brand new number not associated with a player incorrect, and drop them into a challenge flow
 * - text a brand new number not associated with a player correct, and drop them into new game onboarding flow
 *
 */

const getPlayers = require('lib/getPlayers');
const playGame = require('flows/playGame');
const startGame = require('flows/startGame');
const setup = require('lib/setup');
const check = require('lib/check');
const rule = require('../../config/rule');
const clue = rule('clue').example();
const game_numbers = require('../../../testqueue/config/numbers');
const help = rule('help').example();
import setupNGames from 'flows/twoGames';
//const EMOJI = '😀';
const phrases = [
  { id: 1, phrase: 'JURASSIC PARK', sender_id: 4 },
  { id: 2, phrase: 'SILENCE OF THE LAMBS', sender_id: 5 },
  { id: 3, phrase: 'BUFFALO WILD WINGS', sender_id: 3 },
  //{ id: 4, phrase: 'DOCTOR WHO' }
];

const getPlayer = (phrase_id) => {
  const player = getPlayers(1)[0];
  player.to = phrases[phrase_id].sender_id;
  return player;
};

describe('Challenge', () => {
  describe('Challenge to Onboarding Flow', () => {
    it('should drop a user into onboarding on correct answer', () => {
      const player = getPlayer(0);
      return check(
        { player, msg: phrases[0].phrase },
        [
          { key: 'challenge_is_correct', to: player }
        ]
      );
    });

    it('should handle the correct challenge', () => {
      const player = getPlayer(1);
      return check(
        { player, msg: phrases[1].phrase },
        [
          { key: 'challenge_is_correct', to: player }
        ]
      );
    });

    it('should disregard a correct challenge from a different clue', () => {
      const player = getPlayer(1);
      return check(
        { player, msg: phrases[0].phrase },
        [
          { key: 'challenge_is_incorrect', to: player }
        ]
      );
    });

    it('should continue with regular onboarding on correct answer', () => {
      const player = getPlayer(1);
      return setup([
        { player, msg: phrases[1].phrase },
      ]).then(() => {
        return check(
          { player, msg: player.nickname },
          [
            { key: 'intro_3', options: [ player.nickname, '*' ], to: player }
          ]
        );
      });
    });
  });

  describe('Challenge Flow', () => {
    it('an incorrect guess followed by correct should drop into onboarding', () => {
      const player = getPlayer(1);
      return setup([
        { player, msg: 'foobar' },
        { player, msg: phrases[1].phrase },
      ]).then(() => {
        return check(
          { player, msg: player.nickname },
          [
            { key: 'intro_3', options: [ player.nickname, '*' ], to: player }
          ]
        );
      });
    });

    it('a user should be able to ask for a clue', () => {
      const player = getPlayer(1);
      return setup([
        { player, msg: 'fooey' },
      ]).then(() => {
        return check(
          { player, msg: clue },
          [
            { key: 'challenge_clue', options: { phrase: { clue: '*' }}, to: player }
          ]
        );
      });
    });

    it('a user should be able to ask for help', () => {
      const player = getPlayer(1);
      return setup([
        { player, msg: 'fooey' },
      ]).then(() => {
        return check(
          { player, msg: help },
          [
            { key: 'challenge_help', options: { phrase: { prompt: '*' }}, to: player }
          ]
        );
      });
    });
  });

  describe('New game', () => {
    it('should alert a user on an incorrect guess to a new challenge number', () => {
      const players = getPlayers(3);
      return playGame(players).then(() => {
        const player = players[0];

        player.to = phrases[1].sender_id;
        return check(
          { player, msg: 'foo' },
          [
            { key: 'challenge_is_incorrect', to: player }
          ]
        );
      });
    });

    it('should drop a user into new game flow on correct answer', () => {
      const players = getPlayers(3);
      return playGame(players).then(() => {
        const player = players[0];

        player.to = phrases[1].sender_id;
        return check(
          { player, msg: phrases[1].phrase },
          [
            { key: 'challenge_correct_new_game', to: player }
          ]
        );
      });
    });

    it('should drop a user into new game invite flow after correct answer', () => {
      const players = getPlayers(3);
      return playGame(players).then(() => {
        const player = players[0];

        player.to = phrases[1].sender_id;
        return setup([
          { player, msg: phrases[1].phrase },
        ]).then(() => {
          const new_player = getPlayers(1)[0];
          return check(
            { player, msg: rule('invite').example() + new_player.number },
            [
              { key: 'intro_5', options: [new_player.number], to: players[0] },
              { key: 'invite', options: [players[0].nickname, players[0].avatar], to: new_player }
            ]
          );
        });
      });
    });

    it('should not accept a challenge on a new game the user has just started', () => {
      const players = getPlayers(2);
      return setupNGames(3, true)(players).then(() => {
        const player = players[0];
        player.to = phrases[2].sender_id;

        const msg = phrases[2].phrase;

        return check(
          { player, msg },
          [
            { key: 'says', options: [player.nickname, player.avatar, rule('guess').example() + msg], to: players[1], from: player.to },
          ]
        );
      });
    });


    it('a user should be able to ask for a clue on a new game', () => {
      const players = getPlayers(2);
      return setupNGames(1, true)(players).then(() => {
        const player = players[0];
        player.to = phrases[1].sender_id;

        const msg = phrases[1].phrase;

        return check(
          { player, msg: clue },
          [
            { key: 'challenge_clue', options: { phrase: { clue: '*' }}, to: player }
          ]
        );
      });
    });

    it('a user should be able to ask for help on a new game', () => {
      const players = getPlayers(2);
      return setupNGames(1, true)(players).then(() => {
        const player = players[0];
        player.to = phrases[1].sender_id;

        const msg = phrases[1].phrase;

        return check(
          { player, msg: help },
          [
            { key: 'challenge_help', options: { phrase: { prompt: '*' }}, to: player }
          ]
        );
      });
    });

    it('should not create a new game on a number where a user is currently challenge guessing', () => {
      const players = getPlayers(2);
      return playGame(players).then(() => {
        const player = players[0];

        player.to = phrases[2].sender_id;
        return setup([
          { player, msg: rule('new-game').example(), to: game_numbers[0] },
          { player, msg: 'foo' },
        ]).then(() => {
          return check(
            { player, msg: rule('new-game').example(), to: game_numbers[0] },
            [
              { key: 'new-game', options: [player.nickname, player.avatar], to: player, from: game_numbers[3] },
            ]
          );
        });
      });
    });

    it('should not allow more than the max number of games after starting a challenge flow', () => {
      const players = getPlayers(2);
      return playGame(players).then(() => {
        const player = players[0];

        player.to = phrases[2].sender_id;
        return setup([
          { player, msg: 'foo' },
          { player, msg: rule('new-game').example(), to: game_numbers[0] },
          { player, msg: rule('new-game').example(), to: game_numbers[0] },
          { player, msg: rule('new-game').example(), to: game_numbers[0] },
        ]).then(() => {
          return check(
            { player, msg: rule('new-game').example(), to: game_numbers[0] },
            [
              { key: 'error-maximum-games', to: players[0], from: game_numbers[0] }
            ]
          );
        });
      });
    });

    it('should not allow more than the max number of games before starting a challenge flow', () => {
      const players = getPlayers(2);
      return playGame(players).then(() => {
        const player = players[0];

        return setup([
          { player, msg: rule('new-game').example(), to: game_numbers[0] },
          { player, msg: rule('new-game').example(), to: game_numbers[0] },
          { player, msg: rule('new-game').example(), to: game_numbers[0] },
        ]).then(() => {
          const from = 5;
          player.to = from;
          return check(
            { player, msg: 'foo' },
            [
              { key: 'error-maximum-games', to: players[0], from }
            ]
          );
        });
      });
    });
  });
});
