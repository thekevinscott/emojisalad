var User = require('../../models/user');
var Phone = require('../../models/phone');
var Text = require('../../models/text');

module.exports = function(req, res) {
  var user_id = req.params.user_id;
  var data = req.body;
  console.log('user update', user_id, data);
  User.update({ id: user_id }, data).then(function(result) {
    res.json(result);
  }).fail(function(err) {
    res.json({ error: err });
  });
}
