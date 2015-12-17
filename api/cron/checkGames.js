'use strict';
const Game = require('models/game');
const Promise = require('bluebird');
const EMOJI = '👾';

function getDayAgo() {
  const day_ago = new Date();
  day_ago.setDate(day_ago.getDate() - 1);
  return day_ago;
}

var checkGames = Promise.coroutine(function* () {
  let games;

  // get a list of games with no activity for at least 24 hours.
  // THIS DOESNT WORK BECAUSE
  // games returned via all don't include associated rounds,
  // or associated players. Those are all pretty heavy queries.
  //games = yield Game.getAll({ last_activity: getDayAgo() });
  games = yield Game.get({ id: 73 }); // get kevin's game
  games = [games];
  
  console.debug('there are', games.length, 'games with no activity');
  return games.map(function(game) {
    console.debug('game', game);
    // if there's no game round, probably an error
    if ( game.round ) {
      return sendAlert('bump', game.players);
      if ( game.round.state === 'waiting-for-submission' ) {
        return sendAlert('waiting-for-submission', [game.round.submitter]);
      } else if ( game.round.state === 'playing' ) {
        return sendAlert('playing', game.players);
      } else {
        console.debug('No correct round state, how odd');
        console.debug(game);
      }
    } else {
      console.debug('No Game round, how odd');
      console.debug(game);
    }
  });
});

function sendAlert(key, game_players) {
  return game_players.map(function(game_player) {
    console.debug('send', key, 'to player', game_player.nickname);
    if ( key === 'bump' ) {
      return {
        player: game_player,
        key: 'says',
        options: [
          'Emojibot',
          EMOJI,
          'The time is: ' + new Date()
        ]
      };
    } else if ( key === 'waiting-for-submission' ) {
      //return {
        //player: game_player,
        //key 
      //};
    } else if ( key === 'playing' ) {
    }
  });
}

module.exports = checkGames;
