var User = require('../../models/user');
var Phone = require('../../models/phone');
var Text = require('../../models/text');

module.exports = function(req, res) {
  var user_id = req.params.user_id;
  var data = req.body;
  console.log('begin the user update');
  User.update({ id: user_id }, data).then(function(result) {
    console.log('user update fine');
    res.json(result);
  }).fail(function(err) {
    console.log('user update error');
    res.json({ error: err });
  });
}
