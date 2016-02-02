const post = require('test/support/request').post;

const User = require('models/user');
const Player = require('models/player');
const Game = require('models/game');
const game_number = '+15559999999';
describe('Create', function() {

  describe('Invalid', function() {
    it('should reject if not given an array', function() {
      return post({
        url: '/games',
        data: { foo: 'bar' }
      }).then((res) => {
        res.statusCode.should.equal(400);
        res.error.text.should.contain('You must provide an array of users');
      });
    });

    it('should reject if not given a valid user object', function() {
      return post({
        url: '/games',
        data: [ {foo: 'bar'} ]
      }).then((res) => {
        res.statusCode.should.equal(400);
        res.error.text.should.contain('You must provide a valid user');
      });
    });

    it('should reject an invalid user id', function() {
      return post({
        url: '/games',
        data: [{ id: 'bar' }]
      }).then((res) => {
        res.statusCode.should.equal(400);
        res.error.text.should.contain('You must provide a valid user');
      });
    });

    it('should reject a non-existent user id', function() {
      return post({
        url: '/games',
        data: [{ id: 123456789 }]
      }).then((res) => {
        res.statusCode.should.equal(400);
        res.error.text.should.contain('You must provide a valid user');
      });
    });
  });

  describe('Valid', function() {
    it('should create a game', function() {
      const from = Math.random();

      return User.create({ from: from }).then((user) => {
        const payload = [{ id: user.id }];

        return Game.find().then((games) => {
          const len = games.length;
          return post({
            url: '/games',
            data: payload
          }).then((res) => {
            res.statusCode.should.equal(200);
            return Game.find();
          }).then((games) => {
            games.length.should.equal(len + 1);
          });
        });
      });
    });

    it('should create a new player for a game', function() {
      const from = Math.random();

      return User.create({ from: from }).then((user) => {
        const payload = [{ id: user.id }];

        return Player.find().then((players) => {
          const len = players.length;
          return post({
            url: '/games',
            data: payload
          }).then((res) => {
            res.statusCode.should.equal(200);
            return Player.find();
          }).then((players) => {
            players.length.should.equal(len + 1);
          });
        });
      });
    });

    it('should create a new player with a default to if none is provided', function() {
      const from = Math.random();
      return User.create({ from: from }).then((user) => {
        const payload = [{ id: user.id }];

        return Player.find().then((players) => {
          const len = players.length;
          return post({
            url: '/games',
            data: payload
          }).then((res) => {
            res.statusCode.should.equal(200);
            res.body.players.length.should.be.above(0);
            res.body.players[0].should.have.property('user_id', user.id);
            res.body.players[0].should.have.property('id');
            res.body.players[0].should.have.property('to');
            return Player.findOne(res.body.players[0].id);
          }).then((player) => {
            player.should.have.property('user_id', user.id);
            player.should.have.property('to');
          });
        });
      });
    });

    it('should create a new player with a provided to if one is provided', function() {
      const from = Math.random();
      return User.create({ from: from }).then((user) => {
        const payload = [{ id: user.id, to: game_number }];

        return Player.find().then((players) => {
          const len = players.length;
          return post({
            url: '/games',
            data: payload
          }).then((res) => {
            res.statusCode.should.equal(200);
            res.body.players.length.should.be.above(0);
            res.body.players[0].should.have.property('user_id', user.id);
            res.body.players[0].should.have.property('id');
            res.body.players[0].should.have.property('to', game_number);
            return Player.findOne(res.body.players[0].id);
          }).then((player) => {
            player.should.have.property('user_id', user.id);
            player.should.have.property('to', game_number);
          });
        });
      });
    });

    it('should not create a new player with a pre existing to', function() {
      const from = Math.random();

      return User.create({ from: from }).then((user) => {
        const payload = [{ id: user.id, to: game_number }];

        return post({
          url: '/games',
          data: payload
        }).then(() => {
          return Player.find();
        }).then((players) => {
          const len = players.length;
          return post({
            url: '/games',
            data: payload
          }).then((res) => {
            res.statusCode.should.equal(400);
            return Player.find();
          }).then((players) => {
            len.should.equal(players.length);
          });
        });
      });

    });
  });
});
