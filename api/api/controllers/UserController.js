/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  destroy: function( req, res ){
    return User.update({ id: req.param('id') }, { archived: true })
    .exec(function (err, user) {
      if (err) return res.json(err, 400);
      return res.json(user[0]);
    });
  },
  find: function( req, res ) {
    var archived = req.param('archived') || false;
    return User.find({ archived: archived })
    .exec(function (err, users) {
      if (err) return res.json(err, 400);
      return res.json(users);
    });
  },
  games: function( req, res ) {
    return User.find({ id: req.param('user_id') })
    .exec(function (err, users) {
      if (err) {
        return res.json(err, 400);
      } else {
        return Game.find({ })
        .exec(function (err, users) {
          if (err) return res.json(err, 400);
          return res.json(users);
        });
      }
    });
  }
};
