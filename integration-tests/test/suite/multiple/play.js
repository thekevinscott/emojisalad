'use strict';
const _ = require('lodash');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const services = require('config/services');
const port = services.api.port;
const getPlayers = require('lib/getPlayers');
const playGames = require('flows/playGames');
const playGame = require('flows/playGame');
const check = require('lib/check');
const setup = require('lib/setup');
const rule = require('config/rule');
//const Game = require('models/game');
//const Player = require('models/player');
//const Round = require('models/round');
//const Message = require('models/Message');

const EMOJI = '😀';
const game_numbers = require('config/numbers');

describe('Play', () => {
  describe('Existing Player', () => {
    it('should onboard an existing user to a new pending game', () => {
      const players = getPlayers(2);
      return setupTwoGames(players).then(() => {
        return check(
          { player: players[1], msg: 'yes', to: game_numbers[1] },
          [
            { key: 'accepted-invited', options: [players[1].nickname, players[1].avatar], to: players[0] },
            { key: 'accepted-inviter', options: [players[1].nickname, players[1].avatar, players[0].nickname, players[0].avatar], to: players[1] },
            { key: 'game-start', options: [players[0].nickname, players[0].avatar, '*'], to: players[0] }
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
            { key: 'accepted-invited', options: [players[2].nickname, players[2].avatar], to: players[0] },
            { key: 'join-game', options: [players[2].nickname, players[2].avatar], to: players[1] },
            { key: 'accepted-inviter', options: [players[2].nickname, players[2].avatar, players[0].nickname, players[0].avatar], to: players[2] }
          ]
        );
      });
    });

    it('should onboard an existing user to the bench of a new game', () => {
      const players = getPlayers(3);
      return setupTwoGames(players).then(() => {
        return setup([
          { player: players[1], msg: 'yes', to: game_numbers[1] },
          { player: players[0], msg: EMOJI, to: game_numbers[1] }
        ]);
      }).then(() => {
        return check(
          { player: players[2], msg: 'yes', to: game_numbers[1] },
          [
            { key: 'accepted-invited-next-round', options: [players[2].nickname, players[2].avatar], to: players[0] },
            { key: 'join-game-next-round', options: [players[2].nickname, players[2].avatar], to: players[1] },
            { key: 'accepted-inviter-next-round', options: [players[2].nickname, players[2].avatar, players[0].nickname, players[0].avatar], to: players[2] }
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
          { player: invitee, msg: rule('yes').example(), to: game_numbers[0] },
          { player: invitee, msg: invitee.nickname, to: game_numbers[0] }
        ]);
      }).then(() => {
        return check(
          { player: invitee, msg: invitee.avatar, to: game_numbers[0] },
          [
            { key: 'accepted-invited', options: [invitee.nickname, invitee.avatar], to: players[0] },
            { key: 'accepted-inviter', options: [invitee.nickname, invitee.avatar, players[0].nickname, players[0].avatar], to: invitee },
            { key: 'game-start', options: [players[0].nickname, players[0].avatar, '*'], to: players[0] }
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
          { player: invitee, msg: rule('yes').example(), to: game_numbers[0] },
          { player: invitee, msg: invitee.nickname, to: game_numbers[0] }
        ]);
      }).then(() => {
        return check(
          { player: invitee, msg: invitee.avatar, to: game_numbers[0] },
          [
            { key: 'accepted-invited', options: [invitee.nickname, invitee.avatar], to: players[0] },
            { key: 'join-game', options: [invitee.nickname, invitee.avatar], to: players[1] },
            { key: 'accepted-inviter', options: [invitee.nickname, invitee.avatar, players[0].nickname, players[0].avatar], to: invitee }
          ]
        );
      });
    });
  });

  it.only('should be able to submit submissions to two simultaneous games', () => {
    const players = getPlayers(3);
    return playGames(players, 2).then(() => {
      const url = `http://localhost:${port}/players`;
      return request({
        url,
        method: 'get',
        qs: {
          from: players[0].from
        }
      });
    }).then((res) => {
      const body = res.body;
      console.log('body', body);
      _.uniq(game_ids).length.should.equal(2);
    });
  });

  it('should be able to guess on two simultaneous games', () => {
    const players = getPlayers(3);
    const guesser = players[1];
    //const existing_player = players[1];
    return playGames(players, 2).then(() => {
      return Player.get(guesser);
    }).then((player) => {
      const msg = 'foo';
      return Promise.all(game_numbers.map((game_number) => {
        return Game.get({ player }).then(() => {
          return check(
            { player, msg: rule('guess').example()+msg, to: game_number },
            [
              { key: 'says', options: [player.nickname, player.avatar, rule('guess').example() + msg], to: players[0] },
              { key: 'says', options: [player.nickname, player.avatar, rule('guess').example() + msg], to: players[2] }
            ]
          );
        });
      }));
    });
  });

  it('should be able to ask for clues to two simultaneous games', () => {
    const players = getPlayers(3);
    const guesser = players[1];
    return playGames(players, 2).then(() => {
      return Player.get(guesser);
    }).then(() => {
      return Promise.all(game_numbers.map((game_number) => {
        return check(
          { player: players[2], msg: rule('clue').example(), to: game_number },
          [
            { key: 'says', options: [players[2].nickname, players[2].avatar, rule('clue').example()], to: players[0] },
            { key: 'says', options: [players[2].nickname, players[2].avatar, rule('clue').example()], to: players[1] },
            { key: 'clue', options: [players[2].nickname, 'MOVIE'], to: players[0] },
            { key: 'clue', options: [players[2].nickname, 'MOVIE'], to: players[1] },
            { key: 'clue', options: [players[2].nickname, 'MOVIE'], to: players[2] }
          ]
        );
      })).then((responses) => {
        responses.length.should.equal(2);
      });
    });
  });

  it('should be able to ask for help to two simultaneous games', () => {
    const players = getPlayers(3);
    const guesser = players[1];
    //const existing_player = players[1];
    return playGames(players, 2).then(() => {
      return Player.get(guesser);
    }).then((player) => {
      return Promise.all(game_numbers.map((game_number) => {
        return setup([
          { player, msg: rule('help').example(), to: game_number }
        ]);
      })).then((responses) => {
        const EMOJI_CLUE = '😀';
        const game = { round: { submission: EMOJI_CLUE } };
        responses.length.should.equal(2);
        return Message.get(['help-player-guessing'], {'help-player-guessing': {game}}).then((message) => {
          message = message.pop();
          const first = responses[0][0];
          const second = responses[1][0];
          first.Response.Sms[0]._.should.equal(message.message);
          second.Response.Sms[0]._.should.equal(message.message);
          first.Response.Sms[0].$.from.should.equal(game_numbers[0]);
          second.Response.Sms[0].$.from.should.equal(game_numbers[1]);
        });
      });
    });
  });
});

const getGames = (player_object, fn) => {
  return Promise.all(game_numbers.map((game_number) => {
    const player_params = {
      to: game_number,
      from: player_object.from
    };
    return Player.get(player_params).then((player) => {
      return Game.get({ player }).then((game) => {
        return fn(game);
      });
    });
  }));
}

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
}
