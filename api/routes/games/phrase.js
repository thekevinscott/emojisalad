var User = require('../../models/user');
//var Phone = require('../../models/phone');
//var Text = require('../../models/text');
var Game = require('../../models/game');
//var Invite = require('../../models/invite');

module.exports = function(req, res) {
  var game_id = req.params.game_id;
  Game.getPhrase(game_id).then(function(phrase){
    res.json({ phrase: phrase });
  }).catch(function(err) {
    console.log('error getting phrase', err);
    res.json( err );
  });
};
