'use strict';
const _ = require('lodash');
const getPlayers = require('test/integration/lib/getPlayers');
const playGames = require('test/integration/flows/playGames');
//const check = require('test/integration/lib/check');
const setup = require('test/integration/lib/setup');
const rule = require('config/rule');
const Game = require('models/game');
const Player = require('models/player');
const Round = require('models/round');
const Message = require('models/Message');

const game_numbers = require('../../../../../config/numbers');

describe('Play', function() {
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
      return Promise.all(game_numbers.map(function(game_number) {
        return setup([
          { player: player, msg: rule('guess').example(), to: game_number },
        ]);
      })).then(function() {
        return getGames(player, function(game) {
          game.round.players.map(function(player) {
            if ( player.id === player.id ) {
              return player;
            }
          }).filter(function(el) {
            return el;
          }).pop().guesses.should.equal(1);

          return game.id;
        });
      });
    }).then(function(game_ids) {
      _.uniq(game_ids).length.should.equal(2);
    });
  });

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
          game.round.players.map(function(player) {
            if ( player.id === player.id ) {
              return player;
            }
          }).filter(function(el) {
            return el;
          }).pop().state.should.equal('lost');

          return game.id;
        });
      });
    }).then(function(game_ids) {
      _.uniq(game_ids).length.should.equal(2);
    });
  });

  it('should be able to ask for clues to two simultaneous games', function() {
    let players = getPlayers(3);
    let guesser = players[1];
    //let existing_player = players[1];
    return playGames(players, 2).then(function() {
      return Player.get(guesser);
    }).then(function(player) {
      return Promise.all(game_numbers.map(function(game_number) {
        return setup([
          { player: player, msg: rule('clue').example(), to: game_number },
        ]);
      })).then(function() {
        return getGames(player, function(game) {
          return Round.getCluesLeft(game).then(function(clues_left) {
            clues_left.should.equal(0);
            return game.id;
          });
        });
      });
    }).then(function(game_ids) {
      _.uniq(game_ids).length.should.equal(2);
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
        responses.length.should.equal(2);
        return Message.get(['help-player-guessing']).then(function(message) {
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
          game.players.map(function(player) {
            if ( player.id === player.id ) {
              matching_player = player;
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

});

function getGames(player, fn) {
  return Promise.all(game_numbers.map(function(game_number) {
    player.game_number = game_number;
    return Game.get({ player: player }).then(function(game) {
      return fn(game);
    });
  }));
}
