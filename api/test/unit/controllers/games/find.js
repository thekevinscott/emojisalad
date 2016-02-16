const get = require('test/support/request').get;
const post = require('test/support/request').post;

const User = require('models/user');
const Player = require('models/player');
const Game = require('models/game');
const game_number = '+15559999999';
describe('Find', function() {
  const from = Math.random();
  let player_id;
  before(function() {
    return User.create({ from: from }).then((user) => {
      const payload = { users: [{ id: user.id }] };
      return post({
        url: '/games',
        data: payload
      })
    }).then((res) => {
      player_id = res.body.players[0].id;
    });
  });

  /*
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
*/
  it('should return a list of all games', function() {
    return get({ url: '/games' }).then((res) => {
      res.statusCode.should.equal(200);
      res.body.length.should.be.above(0);
      res.body[0].should.have.property('id');
      res.body[0].should.have.property('players');
      res.body[0].should.have.property('created');
      res.body[0].should.have.property('round');
      res.body[0].players.should.be.an('array');
      res.body[0].players[0].should.have.property('id');
      res.body[0].players[0].should.have.property('avatar');
      res.body[0].players[0].should.have.property('user_id');
    });
  });

  it('should return a game based off of a player id', function() {

    return Game.find({ player_id: player_id }).then((games) => {
      let game = games[0];
      return get({ url: `/games/`, data: { player_id: player_id }}).then((res) => {
        res.statusCode.should.equal(200);
        let body = res.body[0];
        body.id.should.equal(game.id);
        body.players[0].id.should.equal(game.players[0].id);
        //body.rounds[0].should.equal(game.rounds[0]);
        new Date(body.created).should.equalDate(game.created);
      });
    });
  });

  describe('findOne', function() {
    it('should only accept numeric IDs', function() {
      return get({ url: `/games/foo` }).then((res) => {
        res.statusCode.should.equal(400);
      });
    });

    it('should return blank for a game not found', function() {
      return get({ url: `/games/999999999` }).then((res) => {
        res.statusCode.should.equal(200);
        res.body.should.not.have.property('id');
      });
    });

    it('should return a single game', function() {
      return Game.find().then((games) => {
        let game = games[0];
        return get({ url: `/games/${game.id}` }).then((res) => {
          res.statusCode.should.equal(200);
          res.body.id.should.equal(game.id);
          res.body.players[0].id.should.equal(game.players[0].id);
          //res.body.rounds[0].should.equal(game.rounds[0]);
          new Date(res.body.created).should.equalDate(game.created);
        });
      });
    });
  });
});

