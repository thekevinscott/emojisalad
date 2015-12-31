'use strict';
const _ = require('lodash');
const getPlayers = require('test/integration/lib/getPlayers');
const playGames = require('test/integration/flows/playGames');
const playGame = require('test/integration/flows/playGame');
const check = require('test/integration/lib/check');
const setup = require('test/integration/lib/setup');
const rule = require('config/rule');
const Game = require('models/game');
const Player = require('models/player');
const Round = require('models/round');
const Message = require('models/Message');

const EMOJI = '😀';
const game_numbers = require('../../../../../config/numbers');

describe('Play', function() {
  describe('Existing Player', function() {
    it('should onboard an existing user to a new pending game', function() {
      let players = getPlayers(2);
      return setupTwoGames(players).then(function() {
        let firstPhrase = 'JURASSIC PARK';
        return check(
          { player: players[1], msg: 'yes', to: game_numbers[1] },
          [
            { key: 'accepted-invited', options: [players[1].nickname], to: players[0] },
            { key: 'accepted-inviter', options: [players[1].nickname, players[0].nickname], to: players[1] },
            { key: 'game-start', options: [players[0].nickname, firstPhrase], to: players[0] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should onboard an existing user to a new game where the submitter has yet to submit', function() {
      let players = getPlayers(3);
      return setupTwoGames(players).then(function() {
        return setup([
          { player: players[1], msg: 'yes', to: game_numbers[1] },
        ]);
      }).then(function() {
        return check(
          { player: players[2], msg: 'yes', to: game_numbers[1] },
          [
            { key: 'accepted-invited', options: [players[2].nickname], to: players[0] },
            { key: 'join-game', options: [players[2].nickname], to: players[1] },
            { key: 'accepted-inviter', options: [players[2].nickname, players[0].nickname], to: players[2] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should onboard an existing user to the bench of a new game', function() {
      let players = getPlayers(3);
      return setupTwoGames(players).then(function() {
        return setup([
          { player: players[1], msg: 'yes', to: game_numbers[1] },
          { player: players[0], msg: EMOJI, to: game_numbers[1] },
        ]);
      }).then(function() {
        //let firstPhrase = 'JURASSIC PARK';
        return check(
          { player: players[2], msg: 'yes', to: game_numbers[1] },
          [
            { key: 'accepted-invited-next-round', options: [players[2].nickname], to: players[0] },
            { key: 'join-game-next-round', options: [players[2].nickname], to: players[1] },
            { key: 'accepted-inviter-next-round', options: [players[2].nickname, players[0].nickname], to: players[2] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });
  });

  describe('New Player', function() {
    it('should onboard a new user to a new pending game', function() {
      let players = getPlayers(2);
      let invitee = getPlayers(4).pop();
      return setupTwoGames(players, invitee).then(function() {
        return setup([
          { player: invitee, msg: rule('yes').example(), to: game_numbers[0] },
          { player: invitee, msg: invitee.nickname, to: game_numbers[0] },
        ]);
      }).then(function() {
        let firstPhrase = 'JURASSIC PARK';
        return check(
          { player: invitee, msg: rule('keep').example(), to: game_numbers[0] },
          [
            { key: 'accepted-invited', options: [invitee.nickname], to: players[0] },
            { key: 'accepted-inviter', options: [invitee.nickname, players[0].nickname], to: invitee },
            { key: 'game-start', options: [players[0].nickname, firstPhrase], to: players[0] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should onboard a new user to a new game where the submitter has yet to submit', function() {
      let players = getPlayers(2);
      let invitee = getPlayers(4).pop();
      return setupTwoGames(players).then(function() {
        return setup([

          { player: players[1], msg: rule('yes').example(), to: game_numbers[1] },
          { player: players[0], msg: rule('invite').example()+invitee.number, to: game_numbers[1] },
          { player: invitee, msg: rule('yes').example(), to: game_numbers[0] },
          { player: invitee, msg: invitee.nickname, to: game_numbers[0] },
        ]);
      }).then(function() {
        return check(
          { player: invitee, msg: rule('keep').example(), to: game_numbers[0] },
          [
            { key: 'accepted-invited', options: [invitee.nickname], to: players[0] },
            { key: 'join-game', options: [invitee.nickname], to: players[1] },
            { key: 'accepted-inviter', options: [invitee.nickname, players[0].nickname], to: invitee },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should onboard a new user to the bench of a new game', function() {
      let players = getPlayers(3);
      let invitee = getPlayers(4).pop();
      return setupTwoGames(players).then(function() {
        return setup([
          { player: players[0], msg: rule('invite').example()+invitee.number, to: game_numbers[1] },
          { player: players[1], msg: rule('yes').example(), to: game_numbers[1] },
          { player: players[0], msg: EMOJI, to: game_numbers[1] },
          { player: invitee, msg: rule('yes').example(), to: game_numbers[0] },
          { player: invitee, msg: invitee.nickname, to: game_numbers[0] },
        ]);
      }).then(function() {
        return check(
          { player: invitee, msg: rule('keep').example(), to: game_numbers[0] },
          [
            { key: 'accepted-invited-next-round', options: [invitee.nickname], to: players[0] },
            { key: 'join-game-next-round', options: [invitee.nickname], to: players[1] },
            { key: 'accepted-inviter-next-round', options: [invitee.nickname, players[0].nickname], to: invitee },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });
  });

  it('should be able to submit submissions to two simultaneous games', function() {
    let players = getPlayers(3);
    //let existing_player = players[1];
    return playGames(players, 2).then(function() {
      return Player.get(players[0]);
    }).then(function(player) {
      return getGames(player, function(game) {
        game.round.state.should.equal('playing');
        return game.id;
      });
    }).then(function(game_ids) {
      _.uniq(game_ids).length.should.equal(2);
    });
  });

  it('should be able to guess on two simultaneous games', function() {
    let players = getPlayers(3);
    let guesser = players[1];
    //let existing_player = players[1];
    return playGames(players, 2).then(function() {
      return Player.get(guesser);
    }).then(function(player) {
      let msg = 'foo';
      return Promise.all(game_numbers.map(function(game_number) {
        return Game.get({ player: player }).then(function(game) {
          return check(
            { player: player, msg: rule('guess').example()+msg, to: game_number },
            [
              { key: 'says', options: [player.nickname, player.avatar, rule('guess').example() + msg], to: players[0] },
              { key: 'says', options: [player.nickname, player.avatar, rule('guess').example() + msg], to: players[2] },
            ]
          ).then(function(obj) {
            obj.output.should.deep.equal(obj.expected);
          });
        });
      }));
    });
  });

  /*
  it('should be able to lose on two simultaneous games', function() {
    let players = getPlayers(3);
    let guesser = players[1];
    //let existing_player = players[1];
    return playGames(players, 2).then(function() {
      return Player.get(guesser);
    }).then(function(player) {
      return Promise.all(game_numbers.map(function(game_number) {
        return setup([
          { player: player, msg: rule('guess').example(), to: game_number },
          { player: player, msg: rule('guess').example(), to: game_number },
        ]);
      })).then(function() {
        return getGames(player, function(game) {
          let game_player = getPlayerFromGame(game, player);
          game_player.state.should.equal('lost');
          return game.id;
        });
      });
    }).then(function(game_ids) {
      _.uniq(game_ids).length.should.equal(2);
    });
  });
  */

  it('should be able to ask for clues to two simultaneous games', function() {
    let players = getPlayers(3);
    let guesser = players[1];
    return playGames(players, 2).then(function() {
      return Player.get(guesser);
    }).then(function(player) {
      return Promise.all(game_numbers.map(function(game_number) {
        return check(
          { player: players[2], msg: rule('clue').example(), to: game_number },
          [
            { key: 'says', options: [players[2].nickname, players[2].avatar, rule('clue').example()], to: players[0] },
            { key: 'says', options: [players[2].nickname, players[2].avatar, rule('clue').example()], to: players[1] },
            { key: 'clue', options: [players[2].nickname, 'MOVIE'], to: players[0] },
            { key: 'clue', options: [players[2].nickname, 'MOVIE'], to: players[1] },
            { key: 'clue', options: [players[2].nickname, 'MOVIE'], to: players[2] }
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      })).then(function(responses) {
        responses.length.should.equal(2);
      });
    });
  });

  it('should be able to ask for help to two simultaneous games', function() {
    let players = getPlayers(3);
    let guesser = players[1];
    //let existing_player = players[1];
    return playGames(players, 2).then(function() {
      return Player.get(guesser);
    }).then(function(player) {
      return Promise.all(game_numbers.map(function(game_number) {
        return setup([
          { player: player, msg: rule('help').example(), to: game_number },
        ]);
      })).then(function(responses) {
        const EMOJI_CLUE = '😀';
        const game = { round: { submission: EMOJI_CLUE } };
        responses.length.should.equal(2);
        return Message.get(['help-player-guessing'], {'help-player-guessing': {game: game}}).then(function(message) {
          message = message.pop();
          let first = responses[0][0];
          let second = responses[1][0];
          first.Response.Sms[0]._.should.equal(message.message);
          second.Response.Sms[0]._.should.equal(message.message);
          first.Response.Sms[0].$.from.should.equal(game_numbers[0]);
          second.Response.Sms[0].$.from.should.equal(game_numbers[1]);
        });
      });
    });
  });

  /*
  it('should track points separately for two simultaneous games', function() {
    this.timeout(60*2*1000);
    let players = getPlayers(3);
    let guesser = players[1];
    let schloo = players[2];
    //let existing_player = players[1];
    return playGames(players, 2).then(function() {
      return Player.get(guesser);
    }).then(function(player) {
      let winning_guess = 'JURASSIC PARK';
      return setup([
        // lose the first game
        { player: guesser, msg: rule('guess').example() + ' foo', to: game_numbers[0] },
        { player: guesser, msg: rule('guess').example() + 'bar', to: game_numbers[0] },

        // win the second
        { player: guesser, msg: rule('guess').example() + winning_guess, to: game_numbers[1] },

        // complete the first game
        { player: schloo, msg: rule('guess').example() + winning_guess, to: game_numbers[0] },

      ]).then(function() {
        return getGames(player, function(game) {
          let matching_player;
          game.players.map(function(game_player) {
            if ( game_player.user_id === player.user_id ) {
              matching_player = game_player;
            }
          });
          return matching_player;
        }).then(function(participants) {
          participants.length.should.equal(2);
          participants[0].score.should.equal(0);
          participants[1].score.should.equal(2);
        });
      });
    });
  });
  */

});

function getGames(player_object, fn) {
  return Promise.all(game_numbers.map(function(game_number) {
    let player_params = {
      to: game_number,
      from: player_object.from
    };
    return Player.get(player_params).then(function(player) {
      return Game.get({ player: player }).then(function(game) {
        return fn(game);
      });
    });
  }));
}

function getPlayerFromGame(game, player) {
  let user = {
    id: player.user_id,
    number: player.number,
    from: player.from
  };

  let players = game.round.players.map(function(game_player) {
    if ( user.id === game_player.user_id ) {
      return game_player;
    }
  }).filter(function(el) {
    return el;
  });

  return players[0];
}

function setupTwoGames(players, invitee) {
  let inviter = players[0];
  return playGame(players).then(function() {
    return setup([
      { player: inviter, msg: rule('new-game').example() },
    ]);
  }).then(function() {
    if ( invitee ) {
      return setup([
        { player: inviter, msg: rule('invite').example()+invitee.number, to: game_numbers[1]}
      ]);
    } else {
      return setup(players.slice(1).map(function(player) {
        return { player: inviter, msg: rule('invite').example()+player.number, to: game_numbers[1]};
      }));
    }
  }).then(function() {
    return Player.get({ from: inviter.number, to: game_numbers[1] }).then(function(gotPlayer) {
      return Game.get({ player: gotPlayer }).then(function(game) {
        return Game.update(game, { random : 0 });
      });
    });
  });
}
