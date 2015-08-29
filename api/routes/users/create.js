var User = require('../../models/user');

module.exports = function(req, res) {
  var number = req.body.number;
  console.log('USER 1', number);
  return User.create({ number: number }).then(function(user) {
    console.log('2', user);
    return res.json({
      id: user.id,
      number: user.number
    });
  }).catch(function(err) {
    console.log('all done!');
    return res.json(err);
  });
}
