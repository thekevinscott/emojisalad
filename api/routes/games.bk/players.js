var User = require('../../models/user');
var Game = require('../../models/game');

module.exports = function(req, res) {
  var user_id = req.body.user_id;

  return Game.getByUsers([{ id: user_id }]).then(function(game) {
    var users = game.players.filter(function(player) {
      if ( player.id !== user_id ) { return true; }
    });
    res.json({ users: users });
  }).catch(function(err) {
    console.log('error getting phrase 3', err);
    res.json( err );
  });
};
