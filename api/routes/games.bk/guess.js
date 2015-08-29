var User = require('../../models/user');
var Game = require('../../models/game');

module.exports = function(req, res) {
  var user_id = req.body.user_id;
  var message = req.body.message;

  var users = [
    {
      id: user_id
    }
  ];

  return Game.getByUsers(users).then(function(game) {
    return Game.checkGuess(game, user_id, message).then(function(result) {
      return Game.getPlayers(game).then(function(players) {
        players = players.filter(function(player) {
          if ( player.id !== user_id ) { return true; }
        });
        res.json({ result: result, users: players });
      });
    });
  }).catch(function(err) {
    console.log('error getting phrase 1', err);
    res.json( err );
  });
};
