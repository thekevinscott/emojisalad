const playGame = require('flows/playGame');
const setup = require('lib/setup');
const rule = require('config/rule');
const playGames = require('flows/playGames');
const game_numbers = require('../../testqueue/config/numbers');

const inviteUsersToGame = (inviter, players, to, startGames) => {
  return setup(players.map((player) => {
    return { player: inviter, msg: rule('invite').example()+player.number, to };
  })).then(() => {
    return setup(players.map(player => {
      if (startGames) {
        return { player, msg: 'yes', to };
      }

      return null;
    }).filter(el => el));
  });
};

const setupNGames = (n = 2, startGames = false) => (players, invitee) => {
  const inviter = players[0];
  const num = Array(n - 1).fill(true);
  return playGame(players).then(() => {
    return setup(num.map(() => {
      return { player: inviter, msg: rule('new-game').example() };
    }));
  }).then(() => {
    const promises = num.map((_, key) => {
      const game_number = game_numbers[key + 1];
      if ( invitee ) {
        return inviteUsersToGame(inviter, [invitee], game_number, startGames);
      } else {
        return inviteUsersToGame(inviter, players.slice(1), game_number, startGames);
      }
    });
    return Promise.all(promises);
  });
};

export default setupNGames;
