var User = require('../../models/user');
var Game = require('../../models/game');

module.exports = function(req, res) {
  var user_id = req.body.user_id;
  return Game.create().then(function(game) {
    console.log('add the game', user_id);
    return Game.add(game, [{
      id: user_id
    }]);
  }).then(function() {
    res.json({});
  }).catch(function(err) {
    res.json(err);
  });
}
