const post = require('test/support/request').post;

const User = require('models/user');
const Player = require('models/player');
const Game = require('models/game');
const game_number = 2;
const protocol = 2;
describe('Create', () => {

  describe('Invalid', () => {
    it('should reject if not given an array', () => {
      return post({
        url: '/games',
        data: { foo: 'bar' }
      }).then((res) => {
        res.statusCode.should.equal(400);
        res.error.text.should.contain('You must provide an array of users');
      });
    });

    it('should reject if not given a valid user object', () => {
      return post({
        url: '/games',
        data: { users: [ {foo: 'bar'} ] }
      }).then((res) => {
        res.statusCode.should.equal(400);
        res.error.text.should.contain('You must provide a valid user');
      });
    });

    it('should reject an invalid user id', () => {
      return post({
        url: '/games',
        data: { users: [{ id: 'bar' }] }
      }).then((res) => {
        res.statusCode.should.equal(400);
        res.error.text.should.contain('You must provide a valid user');
      });
    });

    it('should reject a non-existent user id', () => {
      return post({
        url: '/games',
        data: { users: [{ id: 123456789, to: 'foo' }] }
      }).then((res) => {
        res.statusCode.should.equal(400);
        res.error.text.should.contain('You must provide a valid user');
      });
    });
  });

  describe('Valid', () => {
    it('should create a game', () => {
      const from = Math.random();

      return User.create({ from, protocol }).then((user) => {
        const payload = { users: [{ id: user.id, to: 'foo' }] };

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

    it('should create a new player for a game', () => {
      const from = Math.random();

      return User.create({ from, protocol }).then((user) => {
        const payload = { users: [{ id: user.id, to: 'foo' }] };

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

    it('should create a new player with a default to if none is provided', () => {
      const from = Math.random();
      return User.create({ from, protocol }).then((user) => {
        const payload = { users: [{ id: user.id, to: 'foo' }] };

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

    it('should create a new player with a provided to if one is provided', () => {
      const from = Math.random();
      return User.create({ from, protocol }).then((user) => {
        const payload = { users: [{ id: user.id, to: game_number }] };

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

    it('should not create a new player with a pre existing to', () => {
      const from = Math.random();

      return User.create({ from, protocol }).then((user) => {
        const payload = { users: [{ id: user.id, to: game_number }] };

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
