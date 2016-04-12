const game_numbers = require('../../testqueue/config/numbers');

const parseSenderIDs = (players) => {
  // the player returned from a game has a to that is an index.
  // this needs to be converted to an actual game number
  return players.map((player) => {
    const to_index = parseInt(player.to) - 1;
    return Object.assign({}, player, {
      to: game_numbers[to_index]
    });
  });
};

module.exports = parseSenderIDs;
