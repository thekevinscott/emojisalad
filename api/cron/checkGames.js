'use strict';
const Game = require('models/game');

function checkGames() {
  // get a list of games with no activity for at least 24 hours.
  const day_ago = new Date();
  day_ago.setDate(day_ago.getDate() - 1);
  Game.get({ last_activity: day_ago }).then(function(games) {
    games.map(function(game) {
      // if there's no game round, probably an error
      if ( game.round ) {
        if ( game.round.state === 'waiting-for-submission' ) {
          sendAlert('waiting-for-submission', [game.round.submitter]);
        } else if ( game.round.state === 'playing' ) {
          sendAlert('playing', game.players);
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

  // switch on their round states
  // * waiting-for-submission - send a message to the submitter. CHECK THAT THIS IS ACTRUALLY BEING SET BY the app.
  // * won - this state can be safely ignored. SCRATCH THAT - if this happens, it means the game is in stasis. This should alert administrators that something is wrong.
  // * playing - send a message to everyone in the group
}

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
