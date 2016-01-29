const Promise = require('bluebird');
const post = require('test/support/request').post;
const put = require('test/support/request').put;

const User = require('models/user');
const users = require('routes/users');
let game_number;
const from = ''+Math.random();
const nickname = ''+Math.random();

describe('Update', function() {
  before(function() {
    game_number = '+15559999999';
    return Promise.all([
      post({ url: '/users', data: { from: from, to: game_number }}),
    ]);
  });

  it('should return an error for a nonexistent user', function() {
    return put({ url: `/users/foo` }).then((res) => {
      res.statusCode.should.equal(400);
    });
  });

  it('should return an error for a nonexistent key', function() {
    return User.findOne({ from: from }).then((user) => {
      const params = {
        url: `/users/${user.id}`, 
        data: { foo: 'bar' }
      };
      return put(params).then((res) => {
        res.statusCode.should.equal(400);
      });
    });
  });

  it('should update a user', function() {
    const nickname = ''+Math.random();
    return User.findOne({ from: from }).then((user) => {
      const params = {
        url: `/users/${user.id}`, 
        data: { nickname: nickname }
      };
      return put(params).then((res) => {
        res.statusCode.should.equal(200);
        res.body.id.should.equal(user.id);
        res.body.from.should.equal(user.from);
        res.body.avatar.should.equal(user.avatar);
        res.body.nickname.should.equal(nickname);
      });
    }).then(() => {
      return User.findOne({ from: from });
    }).then((user) => {
      user.nickname.should.equal(nickname);
    });
  });

});
