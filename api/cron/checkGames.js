'use strict';
const Game = require('models/game');
const Promise = require('bluebird');

function getDayAgo() {
  const day_ago = new Date();
  day_ago.setDate(day_ago.getDate() - 1);
  return day_ago;
}

var checkGames = Promise.coroutine(function* () {
  let games;
  console.log('check games');

  try {
    // get a list of games with no activity for at least 24 hours.
    //games = yield Game.getAll({ last_activity: getDayAgo() });
    games = yield Game.getAll({ id: 73 }); // get kevin's game
  } catch(err) {
    console.error('error', err);
  }
  
  console.log('there are', games.length, 'games with no activity');
  return games.map(function(game) {
    console.log('game', game);
    // if there's no game round, probably an error
    if ( game.round ) {
      if ( game.round.state === 'waiting-for-submission' ) {
        return sendAlert('waiting-for-submission', [game.round.submitter]);
      } else if ( game.round.state === 'playing' ) {
        return sendAlert('playing', game.players);
      } else {
        console.log('No correct round state, how odd');
        console.log(game);
      }
    } else {
      console.log('No Game round, how odd');
      console.log(game);
    }
  });
});

function sendAlert(key, players) {
  if ( key === 'waiting-for-submission' ) {
    console.log('waiting for submission key');
  } else if ( key === 'playing' ) {
    console.log('playign key');
  }

  players.map(function(player) {
    console.log('send', key, 'to player', player.nickname);
  });
}

module.exports = checkGames;
