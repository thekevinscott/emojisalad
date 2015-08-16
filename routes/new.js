var Phone = require('../models/phone');
var Text = require('../models/text');

module.exports = function(req, res) {
  var number = req.body.number;
  Phone.create(number).then(function(userNumber) {
    // create a new game
    Text.send(userNumber, 'intro').then(function(message) {
      res.json({});
    }).fail(function(err) {
      res.json(err);
    });

  }).fail(function(err) {
    // possible error - number is already registered.
    res.json({ error: err });
  });
}
