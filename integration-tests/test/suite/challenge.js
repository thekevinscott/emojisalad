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

/*
const getPlayers = require('lib/getPlayers');
const playGame = require('flows/playGame');
const startGame = require('flows/startGame');
const setup = require('lib/setup');
const check = require('lib/check');
const rule = require('../../config/rule');
const clue = rule('clue').example();
//const EMOJI = '😀';
const phrases = [
  { id: 1, phrase: 'JURASSIC PARK' },
  { id: 2, phrase: 'SILENCE OF THE LAMBS' },
  { id: 3, phrase: 'BUFFALO WILD WINGS' },
  { id: 4, phrase: 'DOCTOR WHO' }
];

describe('Challenge', () => {
  describe('Challenge to Onboarding Flow', () => {
    it.only('should drop a user into onboarding on correct answer', () => {
      const player = getPlayers(1)[0];
      return check(
        { player, msg: phrases[0] },
        [
          { key: 'challenge_is_correct', to: player }
        ]
      );
    });

    it('should handle the correct challenge', () => {
      const player = getPlayers(1)[0];
      return check(
        { player, msg: 'other clue' },
        [
          { key: 'challenge_is_correct', to: player }
        ]
      );
    });

    //it('should continue with regular onboarding on correct answer', () => {
      //const player = getPlayers(1)[0];
      //return setup([
        //{ player, msg: correct }
      //]).then(() => {
        //return check(
          //{ player, msg: player.nickname },
          //[
            //{ key: 'intro_3', options: [ player.nickname, '*' ], to: player }
          //]
        //);
      //});
    //});
  });

  describe('Challenge Flow', () => {
  });

  it('should drop a user into new game flow on correct answer', () => {
  });

  it('should drop a user into challenge flow on correct answer', () => {
  });

  it('should not create a new game on a number where a user is currently challenge guessing', () => {
  });

  it('should not allow more than the max number of games taking into account challenge flow', () => {
  });

  it('should gracefully decline a submitter\'s clue request prior to round submission', () => {
    const players = getPlayers(3);

    return startGame(players).then(() => {
      return check(
        { player: players[0], msg: clue },
        [
          { key: 'no-clue-before-submission-for-submitter', options: [], to: players[0] }
        ]
      );
    });
  });

  it('should gracefully decline a guesser\'s clue request prior to round submission', () => {
    const players = getPlayers(3);

    return startGame(players).then(() => {
      return check(
        { player: players[1], msg: clue },
        [
          { key: 'no-clue-before-submission-for-guesser', options: [], to: players[1] }
        ]
      );
    });
  });

  it('should notify all the other players when somebody asks for a clue', () => {
    const players = getPlayers(3);

    return playGame(players).then(() => {
      return check(
        { player: players[1], msg: clue },
        [
          { key: 'says', options: [players[1].nickname, players[1].avatar, clue], to: players[0] },
          { key: 'says', options: [players[1].nickname, players[1].avatar, clue], to: players[2] },
          { key: 'clue_b', options: {
            nickname: players[1].nickname,
            avatar: players[1].avatar,
            game: {
              round: {
                clue: '*',
              },
            },
          }, to: players[0] },
          { key: 'clue_b', options: {
            nickname: players[1].nickname,
            avatar: players[1].avatar,
            game: {
              round: {
                clue: '*',
              },
            },
          }, to: players[1] },
          { key: 'clue_b', options: {
            nickname: players[1].nickname,
            avatar: players[1].avatar,
            game: {
              round: {
                clue: '*',
              },
            },
          }, to: players[2] }
        ]
      );
    });
  });

  it('should repeat the clue if asked a second time', () => {
    const players = getPlayers(3);

    return playGame(players).then(() => {
      return setup([
        { player: players[1], msg: clue }
      ]);
    }).then(() => {
      return check(
        { player: players[1], msg: clue },
        [
          { key: 'says', options: [players[1].nickname, players[1].avatar, clue], to: players[0] },
          { key: 'says', options: [players[1].nickname, players[1].avatar, clue], to: players[2] },
          { key: 'clue_b', options: {
            nickname: players[1].nickname,
            avatar: players[1].avatar,
            game: {
              round: {
                clue: '*',
              },
            },
          }, to: players[0] },
          { key: 'clue_b', options: {
            nickname: players[1].nickname,
            avatar: players[1].avatar,
            game: {
              round: {
                clue: '*',
              },
            },
          }, to: players[1] },
          { key: 'clue_b', options: {
            nickname: players[1].nickname,
            avatar: players[1].avatar,
            game: {
              round: {
                clue: '*',
              },
            },
          }, to: players[2] }
        ]
      );
    });
  });

});
*/

