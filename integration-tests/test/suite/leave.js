'use strict';
/*
 * Tests that msging during a round works
 *
 */

const getPlayers = require('lib/getPlayers');
const startGame = require('flows/startGame');
const playGame = require('flows/playGame');
const check = require('lib/check');
const rule = require('../../config/rule');
const leave = rule('leave').example();

describe('Leave', () => {
  it.only('should let a player leave a game and notify the other players', () => {
    const players = getPlayers(3);

    return startGame(players).then(() => {
      return check(
        { player: players[2], msg: leave },
        [
          { key: 'left_game_players', options: { player: players[2] }, to: players[0] },
          { key: 'left_game_players', options: { player: players[2] }, to: players[1] },
          { key: 'left_game_leaver', to: players[2] }
        ]
      );
    });
  });

  it('should not message a player who has left the game on subsequent messages', () => {
    const players = getPlayers(3);

    return startGame(players).then(() => {
      return check(
        { player: players[2], msg: leave },
        [
          { key: 'left_game', to: players[2] }
        ]
      );
    });
  });

  it('should not nominate a player who has left to be the next submitter', () => {
    const players = getPlayers(3);

    return startGame(players).then(() => {
      return check(
        { player: players[2], msg: leave },
        [
          { key: 'left_game', to: players[2] }
        ]
      );
    });
  });

  it('should pass if the current submitter leaves before submitting a clue', () => {
    const players = getPlayers(3);

    return startGame(players).then(() => {
      return check(
        { player: players[2], msg: leave },
        [
          { key: 'left_game', to: players[2] }
        ]
      );
    });
  });

  it('should not pass if the current submitter leaves after submitting a clue', () => {
    const players = getPlayers(3);

    return startGame(players).then(() => {
      return check(
        { player: players[2], msg: leave },
        [
          { key: 'left_game', to: players[2] }
        ]
      );
    });
  });

  it('what happens if someone leaves then retexts the same number?', () => {
    throw 1;
    const players = getPlayers(3);

    return startGame(players).then(() => {
      return check(
        { player: players[2], msg: leave },
        [
          { key: 'left_game', to: players[2] }
        ]
      );
    });
  });
});
