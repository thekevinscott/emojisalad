const post = require('test/support/request').post;

const User = require('models/user');
const users = require('routes/users');
let game_number;
describe('Create', function() {
  before(function() {
    game_number = '+15559999999';
  });
  describe('Invalid', function() {
    it('should reject a missing from', function() {
      return post({
        url: '/users',
        data: { }
      }).then((res) => {
        res.statusCode.should.equal(400);
        res.error.text.should.contain('You must provide a from field');
      });
    });
  });

  describe('Valid', function() {
    it('should create a user', function() {
      return User.find().then((users) => {
        const len = users.length;
        return post({
          url: '/users',
          data: {
            from: ''+Math.random()
          }
        }).then((res) => {
          res.statusCode.should.equal(200);
          return User.find();
        }).then((users) => {
          users.length.should.equal(len + 1);
        });
      });
    });

    it('should respond to create with the user payload', function() {
      const from = ''+Math.random();
      return post({
        url: '/users',
        data: {
          from: from
        }
      }).then((res) => {
        res.body.from.should.equal(from);
        res.body.id.should.be.above(0);
        res.body.should.have.property('avatar');
        res.body.should.have.property('nickname');
        res.body.should.have.property('maximum_games');
        res.body.should.have.property('confirmed');
        res.body.should.have.property('blacklist');
      });
    });

    it('should default to 0 for confirmed', function() {
      const from = ''+Math.random();
      return post({
        url: '/users',
        data: {
          from: from
        }
      }).then((res) => {
        return User.findOne(res.body.id);
      }).then((user) => {
        // confirmed should default to 0
        user.should.have.property('confirmed', 0);
      });
    });
  });
});

