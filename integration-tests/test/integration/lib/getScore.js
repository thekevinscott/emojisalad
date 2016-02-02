'use strict';
function getScore(game, updates) {
  return game.players.map(function(player) {
    let score = player.score;
    if ( updates[player.nickname] ) {
      score += updates[player.nickname];
    }
    return player.nickname + ': ' + score;
  }).join('\n');
}

module.exports = getScore;
