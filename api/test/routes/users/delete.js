const Promise = require('bluebird');
const post = require('test/support/request').post;
const del = require('test/support/request').del;

const User = require('models/user');
const users = require('routes/users');
let game_number;
const from = ''+Math.random();
const nickname = ''+Math.random();

describe('Delete', function() {
  before(function() {
    game_number = '+15559999999';
    return Promise.all([
      post({ url: '/users', data: { from: from, to: game_number }}),
    ]);
  });

  it('should return an error for a nonexistent user', function() {
    return del({ url: `/users/foo` }).then((res) => {
      res.statusCode.should.equal(400);
    });
  });

  it('should delete a user', function() {
    return User.findOne({ from: from }).then((user) => {
      const params = {
        url: `/users/${user.id}`, 
      };
      return del(params).then((res) => {
        res.statusCode.should.equal(200);
      });
    }).then(() => {
      return User.find({ from: from });
    }).then((users) => {
      users.length.should.equal(0);
      return User.find({ from: from, archived: 1 });
    }).then((users) => {
      users.length.should.equal(1);
    });
  });

});
