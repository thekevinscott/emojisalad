const post = require('test/support/request').post;

const User = require('models/user');
const Player = require('models/player');
const players = require('routes/players');
let game_number;
let to;
describe('Create', function() {
  before(function() {
    game_number = '+15559999999';
    to = game_number;
  });

  describe('Invalid', function() {
    it('should reject if missing from and user_id ', function() {
      return post({
        url: '/players',
        data: { to: game_number }
      }).then((res) => {
        res.statusCode.should.equal(400);
        res.error.text.should.contain('You must provide a from or user_id field');
      });
    });

    it('should reject an invalid user from', function() {
      return post({
        url: '/players',
        data: { to: game_number, from: Math.random() }
      }).then((res) => {
        res.statusCode.should.equal(400);
        res.error.text.should.contain('You must provide a valid from or user_id field');
      });
    });

    it('should reject an invalid user id', function() {
      return post({
        url: '/players',
        data: { to: game_number, user_id: 'foobar' }
      }).then((res) => {
        res.statusCode.should.equal(400);
        res.error.text.should.contain('You must provide a valid from or user_id field');
      });
    });
  });

  describe('Valid', function() {
    const from = 'foo';
    let user_id;

    before(function() {
      return User.create({ from: from }).then((user) => {
        user_id = user.id;
      });
    });
    it('should create a player', function() {
      const payload = {
        from: from,
        to: to
      };

      return Player.find().then((players) => {
        const len = players.length;
        return post({
          url: '/players',
          data: payload
        }).then((res) => {
          res.statusCode.should.equal(200);
          return Player.find();
        }).then((players) => {
          players.length.should.equal(len + 1);
        });
      });
    });

    it('should create a player with a default to field', function() {
      const payload = {
        from: from,
      };

      return Player.find().then((players) => {
        const len = players.length;
        return post({
          url: '/players',
          data: payload
        }).then((res) => {
          res.statusCode.should.equal(200);
          res.body.should.have.property('to');
          return Player.find();
        }).then((players) => {
          players.length.should.equal(len + 1);
        });
      });
    });

    it('should respond to create with the player payload', function() {
      const payload = {
        from: from,
        to: to
      };

      return post({
        url: '/players',
        data: payload
      }).then((res) => {
        res.statusCode.should.equal(200);
        res.body.should.have.property('to', game_number);
        res.body.should.have.property('from', from);
        res.body.should.have.property('nickname');
        res.body.should.have.property('avatar');
        res.body.should.have.property('user_id', user_id);
      });
    });
  });
});
