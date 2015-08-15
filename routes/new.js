var Phone = require('../models/phone');
var Text = require('../models/text');

module.exports = function(req, res) {
  var number = req.body.number;
  Phone.create(number).then(function() {
    //var msg = '👾 Hey! I’m Emojibot! I run a game called Emojifun - think Pictionary, but with emojis. Want to play? Text YES to start playing. Text FUCK OFF and I won’t bother you anymore.';
    // create a new game
    Text.send(number, 'intro').then(function(message) {
      console.log(message);
      res.json({});
    }).fail(function(err) {
      res.json(err);
    });

  }).fail(function(err) {
    // possible error - number is already registered.
    res.json({ error: err });
  });
}
