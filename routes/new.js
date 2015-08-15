var Phone = require('../models/phone');

module.exports = function(req, res) {
  var number = req.body.number;
  Phone.create(number).then(function() {
    // create a new game
    res.json({});
  }).fail(function(err) {
    // possible error - number is already registered.
    res.json({ error: err });
  });
}
