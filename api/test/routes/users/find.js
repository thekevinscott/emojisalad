const Promise = require('bluebird');
const post = require('test/support/request').post;
const get = require('test/support/request').get;

const User = require('models/user');
const users = require('routes/users');
let game_number;
const from = ''+Math.random();
const nickname = ''+Math.random();

describe('Find', function() {
  before(function() {
    game_number = '+15559999999';
    return Promise.all([
      post({ url: '/users', data: { from: from, to: game_number }}),
      post({ url: '/users', data: { from: from+'a', to: game_number }}),
      post({ url: '/users', data: { from: Math.random(), to: game_number, nickname: nickname }})
    ]);
  });

  it('should return a list of all users', function() {
    return get({ url: '/users' }).then((res) => {
      res.statusCode.should.equal(200);
      res.body.length.should.be.above(0);
      res.body[0].should.have.property('id');
      res.body[0].should.have.property('from');
      res.body[0].should.have.property('avatar');
      res.body[0].should.have.property('created');
      res.body[0].should.have.property('confirmed');
      res.body[0].should.have.property('blacklist');
    });
  });

  it('should return a list of all users matching a from', function() {
    return get({ url: '/users', data: { from: from }}).then((res) => {
      res.statusCode.should.equal(200);
      res.body.length.should.equal(2);
      res.body[0].should.have.property('id');
      res.body[0].should.have.property('from', from);
      res.body[0].should.have.property('avatar');
      res.body[0].should.have.property('created');
      res.body[0].should.have.property('confirmed');
      res.body[0].should.have.property('blacklist');
    });
  });

  it('should return a list of all users matching a nickname', function() {
    return get({ url: '/users', data: { nickname: nickname }}).then((res) => {
      res.statusCode.should.equal(200);
      res.body.length.should.equal(1);
      res.body[0].should.have.property('id');
      res.body[0].should.have.property('from');
      res.body[0].should.have.property('nickname', nickname);
      res.body[0].should.have.property('avatar');
      res.body[0].should.have.property('created');
      res.body[0].should.have.property('confirmed');
      res.body[0].should.have.property('blacklist');
    });
  });

  describe('findOne', function() {
    it('should only accept numeric IDs', function() {
      return get({ url: `/users/foo` }).then((res) => {
        res.statusCode.should.equal(400);
      });
    });

    it('should return blank for a user not found', function() {
      return get({ url: `/users/999999999` }).then((res) => {
        res.statusCode.should.equal(200);
        res.body.should.not.have.property('id');
      });
    });

    it('should return a single user', function() {
      return User.find().then((users) => {
        let user = users[0];
        return get({ url: `/users/${user.id}` }).then((res) => {
          res.statusCode.should.equal(200);
          res.body.id.should.equal(user.id);
          res.body.from.should.equal(user.from);
          res.body.nickname.should.equal(user.nickname);
          res.body.should.have.property('blacklist');
          res.body.should.have.property('avatar');
          res.body.should.have.property('created');
        });
      });
    });
  });
});
