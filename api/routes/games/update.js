var Game = require('../../models/game');

module.exports = function(req, res) {
  var game_id = req.params.game_id;
  var data = req.body;
  Game.update({ id: game_id }, data).then(function(result) {
    res.json(result);
  }).fail(function(err) {
    res.json({ error: err });
  });
}
