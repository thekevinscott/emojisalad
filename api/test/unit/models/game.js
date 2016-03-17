'use strict';
//const squel = require('squel');
//const db = require('db');
const proxyquire = require('proxyquire');
const User = require('models/user');
const Round = require('models/round');
//const post = require('test/support/request').post;
const Promise = require('bluebird');
//const EMOJI = '👍';

describe('Game', () => {
  describe('getNextSubmitter', () => {
    const getGame = (round) => {
      if ( ! round ) {
        round = {
          findOne: () => {
            return new Promise((resolve) => {
              resolve({});
            });
          }
        };
      }
      return proxyquire('models/game', {
        //'models/round': round
      });
    };

    const createGame = (numbers, round = null) => {

      return Promise.reduce(numbers, (arr, number) => {
        return User.create({ from: number }).then((user) => {
          return arr.concat(user);
        });
      }, []).then((users) => {
        const Game = getGame(round);
        return Game.create([users[0]]).then((game) => {
          if ( users.length > 1 ) {
            return Game.add(game, users.slice(1)).then((game) => {
              return {
                Game,
                game: game
              };
            });
          } else {
            return {
              Game: Game,
              game: game
            };
          }
        });
      });
    };

    it('should return the one player, if no round exists', () => {
      const froms = [
        getRand()
      ];

      return createGame(froms).then((response) => {
        const Game = response.Game;
        const game = response.game;
        Game.getNextSubmitter(game).then((player) => {
          player.from.should.equal(froms[0]);
        });
      });
    });

    it('should return the first player if two exist and no round', () => {
      const froms = [
        getRand(),
        getRand(),
      ];

      return createGame(froms).then((response) => {
        const Game = response.Game;
        const game = response.game;
        Game.getNextSubmitter(game).then((player) => {
          player.from.should.equal(froms[0]);
        });
      });
    });

    it('should return the second player if a round exists', () => {
      const froms = [
        getRand(),
        getRand(),
      ];

      return createGame(froms).then((response) => {
        const Game = response.Game;
        const game = response.game;
        return Round.create(game).then((round) => {
          return Game.getNextSubmitter(game).then((player) => {
            player.from.should.equal(froms[1]);
          });
        });
      });
    });

    it('should return the third player if two rounds exists', () => {
      const froms = [
        getRand(),
        getRand(),
        getRand(),
      ];

      return createGame(froms).then((response) => {
        const Game = response.Game;
        const game = response.game;
        return Round.create(game).then((round) => {
          return Round.create(game);
        }).then((round) => {
          return Game.getNextSubmitter(game).then((player) => {
            player.from.should.equal(froms[2]);
          });
        });
      });
    });

    it('should return the first player if three rounds exists', () => {
      const froms = [
        getRand(),
        getRand(),
        getRand(),
      ];

      return createGame(froms).then((response) => {
        const Game = response.Game;
        const game = response.game;
        return Round.create(game).then((round) => {
          return Round.create(game);
        }).then((round) => {
          return Round.create(game);
        }).then((round) => {
          return Game.getNextSubmitter(game).then((player) => {
            player.from.should.equal(froms[0]);
          });
        });
      });
    });

  });
});

const getRand = () => {
  return ''+Math.random();
}
