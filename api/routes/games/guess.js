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
    res.json({ result: Game.checkGuess(game, message), users: game.players.filter(function(player) {
      if ( player.id !== user_id ) { return true; }
    })});
  }).catch(function(err) {
    console.log('error getting phrase', err);
    res.json( err );
  });
};
