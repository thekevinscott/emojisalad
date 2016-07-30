'use strict';
//const _ = require('lodash');
//const Promise = require('bluebird');
//const request = Promise.promisify(require('request'));
//const services = require('config/services');
//const port = services.api.port;
const getPlayers = require('lib/getPlayers');
const playGames = require('flows/playGames');
const startGames = require('flows/startGames');
const playGame = require('flows/playGame');
const check = require('lib/check');
const setup = require('lib/setup');
const rule = require('config/rule');
const parseSenderIDs = require('lib/parseSenderIDs');
//const Game = require('models/game');
//const Player = require('models/player');
//const Round = require('models/round');
//const Message = require('models/Message');

const EMOJI = '😀';
const game_numbers = require('../../../../testqueue/config/numbers');

const setupTwoGames = (players, invitee) => {
  const inviter = players[0];
  return playGame(players).then(() => {
    return setup([
      { player: inviter, msg: rule('new-game').example() }
    ]);
  }).then(() => {
    if ( invitee ) {
      return setup([
        { player: inviter, msg: rule('invite').example()+invitee.number, to: game_numbers[1] }
      ]);
    } else {
      return setup(players.slice(1).map((player) => {
        return { player: inviter, msg: rule('invite').example()+player.number, to: game_numbers[1] };
      }));
    }
  });
};

describe('Play', () => {
  describe('Existing Player', () => {
    it('should onboard an existing user to a new pending game', () => {
      const players = getPlayers(2);
      return setupTwoGames(players).then(() => {
        return check(
          { player: players[1], msg: 'yes', to: game_numbers[1] },
          [
            { key: 'accepted-invited', options: [players[1].nickname, players[1].avatar], to: players[0], from: game_numbers[1] },
            { key: 'accepted-inviter', options: [players[1].nickname, players[1].avatar, players[0].nickname, players[0].avatar], to: players[1], from: game_numbers[1] },
            { key: 'game-start', options: [players[0].nickname, players[0].avatar, '*'], to: players[0], from: game_numbers[1] }
          ]
        );
      });
    });

    it('should onboard an existing user to a new game where the submitter has yet to submit', () => {
      const players = getPlayers(3);
      return setupTwoGames(players).then(() => {
        return setup([
          { player: players[1], msg: 'yes', to: game_numbers[1] }
        ]);
      }).then(() => {
        return check(
          { player: players[2], msg: 'yes', to: game_numbers[1] },
          [
            { key: 'accepted-invited', options: [players[2].nickname, players[2].avatar], to: players[0], from: game_numbers[1] },
            { key: 'join-game', options: [players[2].nickname, players[2].avatar], to: players[1], from: game_numbers[1] },
            { key: 'accepted-inviter', options: [players[2].nickname, players[2].avatar, players[0].nickname, players[0].avatar], to: players[2], from: game_numbers[1] }
          ]
        );
      });
    });
  });

  describe('New Player', () => {
    it('should onboard a new user to a new pending game', () => {
      const players = getPlayers(2);
      const invitee = getPlayers(1).pop();
      return setupTwoGames(players, invitee).then(() => {
        return setup([
          { player: invitee, msg: rule('yes').example(), to: game_numbers[1] },
          { player: invitee, msg: invitee.nickname, to: game_numbers[1] }
        ]);
      }).then(() => {
        return check(
          { player: invitee, msg: invitee.avatar, to: game_numbers[1] },
          [
            { key: 'accepted-invited', options: [invitee.nickname, invitee.avatar], to: players[0], from: game_numbers[1] },
            { key: 'accepted-inviter', options: [invitee.nickname, invitee.avatar, players[0].nickname, players[0].avatar], to: invitee, from: game_numbers[1] },
            { key: 'game-start', options: [players[0].nickname, players[0].avatar, '*'], to: players[0], from: game_numbers[1] }
          ]
        );
      });
    });

    it('should onboard a new user to a new game where the submitter has yet to submit', () => {
      const players = getPlayers(2);
      const invitee = getPlayers(4).pop();
      return setupTwoGames(players).then(() => {
        return setup([

          { player: players[1], msg: rule('yes').example(), to: game_numbers[1] },
          { player: players[0], msg: rule('invite').example()+invitee.number, to: game_numbers[1] },
          { player: invitee, msg: rule('yes').example(), to: game_numbers[1] },
          { player: invitee, msg: invitee.nickname, to: game_numbers[1] }
        ]);
      }).then(() => {
        return check(
          { player: invitee, msg: invitee.avatar, to: game_numbers[1] },
          [
            { key: 'accepted-invited', options: [invitee.nickname, invitee.avatar], to: players[0], from: game_numbers[1] },
            { key: 'join-game', options: [invitee.nickname, invitee.avatar], to: players[1], from: game_numbers[1] },
            { key: 'accepted-inviter', options: [invitee.nickname, invitee.avatar, players[0].nickname, players[0].avatar], to: invitee, from: game_numbers[1] }
          ]
        );
      });
    });
  });

  it('should be able to submit submissions to two simultaneous games', () => {
    const players = getPlayers(3);
    const number_of_games = 2;
    return startGames(players, number_of_games).then((games) => {
      return Promise.all(games.map((game) => {
        game.round.should.have.property('submission', null);
        const game_players = parseSenderIDs(game.players);
        const game_guesser = game_players[0];

        return check(
          { player: game_guesser, msg: EMOJI },
          [
            { key: 'game-submission-sent', to: game_players[0] },
            { key: 'emojis', options: [game_guesser.nickname, game_guesser.avatar, EMOJI], to: game_players[1] },
            { key: 'emojis', options: [game_guesser.nickname, game_guesser.avatar, EMOJI], to: game_players[2] },
            { key: 'guessing-instructions', to: game_players[1] },
            { key: 'guessing-instructions', to: game_players[2] }
          ]
        );
      })).then((results) => {
        results.length.should.equal(number_of_games);
      });
    });
  });

  it('should be able to cross talk in a game', () => {
    const players = getPlayers(3);
    const number_of_games = 2;
    return playGames(players, number_of_games).then((games) => {
      return Promise.all(games.map((game, index) => {
        const msg = 'foo';
        const game_players = parseSenderIDs(game.players);
        const game_guesser = game_players[1];
        //console.log('game guesser', index, game);
        return check(
          { player: game_guesser, msg: rule('guess').example()+msg },
          [
            { key: 'says', options: [game_guesser.nickname, game_guesser.avatar, rule('guess').example() + msg], to: game_players[0] },
            { key: 'says', options: [game_guesser.nickname, game_guesser.avatar, rule('guess').example() + msg], to: game_players[2] }
          ]
        );
      })).then((results) => {
        results.length.should.equal(number_of_games);
      });
    });
  });

  it('should be able to guess on two simultaneous games', () => {
    const players = getPlayers(3);
    const number_of_games = 2;
    return playGames(players, number_of_games).then((games) => {
      return Promise.all(games.map((game) => {
        const msg = game.round.phrase;
        const game_players = parseSenderIDs(game.players);
        const game_guesser = game_players[1];
        return check(
          { player: game_guesser, msg: rule('guess').example()+msg },
          [
            { key: 'says', options: [game_guesser.nickname, game_guesser.avatar, rule('guess').example() + msg], to: game_players[0] },
            { key: 'says', options: [game_guesser.nickname, game_guesser.avatar, rule('guess').example() + msg], to: game_players[2] },
            { key: 'correct-guess', options: [game_guesser.nickname, game_guesser.avatar, '*'], to: game_players[0] },
            { key: 'correct-guess', options: [game_guesser.nickname, game_guesser.avatar, '*'], to: game_players[1] },
            { key: 'correct-guess', options: [game_guesser.nickname, game_guesser.avatar, '*'], to: game_players[2] },
            { key: 'game-next-round', options: [game_guesser.nickname, game_guesser.avatar], to: game_players[0] },
            { key: 'game-next-round-suggestion', options: [game_guesser.nickname, game_guesser.avatar, '*'], to: game_players[1] },
            { key: 'game-next-round', options: [game_guesser.nickname, game_guesser.avatar], to: game_players[2] }
          ]
        );
      })).then((results) => {
        results.length.should.equal(number_of_games);
      });
    });
  });

  it('should be able to ask for clues to two simultaneous games', () => {
    const players = getPlayers(3);
    const number_of_games = 2;
    return playGames(players, number_of_games).then((games) => {
      return Promise.all(games.map((game) => {
        const game_players = parseSenderIDs(game.players);
        const game_guesser = game_players[1];
        return check(
          { player: game_guesser, msg: rule('clue').example() },
          [
            { key: 'says', options: [game_guesser.nickname, game_guesser.avatar, rule('clue').example()], to: game_players[0] },
            { key: 'says', options: [game_guesser.nickname, game_guesser.avatar, rule('clue').example()], to: game_players[2] },
            { key: 'clue_b', options: [game_guesser.nickname, game_guesser.avatar, '*'], to: game_players[0] },
            { key: 'clue_b', options: [game_guesser.nickname, game_guesser.avatar, '*'], to: game_players[1] },
            { key: 'clue_b', options: [game_guesser.nickname, game_guesser.avatar, '*'], to: game_players[2] }
          ]
        );
      })).then((results) => {
        results.length.should.equal(number_of_games);
      });
    });
  });

  it('should be able to ask for help in two simultaneous games', () => {
    const players = getPlayers(3);
    const number_of_games = 2;
    return playGames(players, number_of_games).then((games) => {
      return Promise.all(games.map((game) => {
        const options = {
          game: {
            round: {
              submission: EMOJI
            }
          }
        };
        const game_players = parseSenderIDs(game.players);
        const helper = game_players[1];
        return check(
          { player: helper, msg: rule('help').example() },
          [
            { key: 'help-player-guessing', options, to: game_players[1] }
          ]
        );
      })).then((results) => {
        results.length.should.equal(number_of_games);
      });
    });
  });
});
