var User = require('../../models/user');
var Game = require('../../models/game');

module.exports = function(req, res) {
  // we support the old, /new route for Website
  // but want to transition to new, /users/create/ POST for new calls
  var user_id = req.params.user_id;
  Game.getByUsers([{
    id: user_id
  }]).then(function(game) {
    if ( game ) {
      res.json(game);
    } else {
      res.json({});
    }
  });
}
