var User = require('../../models/user');
var Game = require('../../models/game');

module.exports = function(req, res) {
  var user_id = req.body.user_id;

  var users = [
    {
      id: user_id
    }
  ];

  return Game.getByUsers(users).then(function(game) {
    return Game.getPhrase(game.id);
  }).then(function(phrase){
    res.json({ phrase: phrase });
  }).catch(function(err) {
    console.log('error getting phrase', err);
    res.json( err );
  });
};
