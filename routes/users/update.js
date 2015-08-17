var User = require('../../models/user');
var Phone = require('../../models/phone');
var Text = require('../../models/text');

module.exports = function(req, res) {
  var user_id = req.params.user_id;
  var data = req.body;
  User.update({ id: user_id }, data).then(function(result) {
    res.json(result);
  }).fail(function(err) {
    res.json({ error: err });
  });
}
