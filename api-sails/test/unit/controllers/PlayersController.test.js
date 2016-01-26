'use strict';
const request = require('supertest');
let game_number;
let game_number_id;
const default_state = 'waiting-for-confirmation';

describe('PlayersController', function() {
  before(function() {
    return GameNumber.findOne().then(function(result) {
      game_number = result.number;
      game_number_id = result.id;
    });
  });

  describe('create()', function() {
    describe('Invalid', function() {
      it('should not create a player without a to number', function () {
        return request(sails.hooks.http.app)
          .post('/players')
          .send({ })
          .expect(400, {
            error: `Invalid to number provided`
          });
      });

      it('should throw an error when trying to create a player without an existing state', function () {
        const state = 'foobar';
        return request(sails.hooks.http.app)
          .post('/players')
          .send({ state: state, to: '123', from: 123 })
          .expect(400, {
            error: `Invalid state provided: ${state}`
          })
      });

      it('should throw an error when trying to create a player without a valid game number', function () {
        const to = 'blah blah';
        return request(sails.hooks.http.app)
          .post('/players')
          .send({ to: to, from: 'foobar' })
          .expect(400, {
            error: `Invalid to number provided: ${to}`
          })
      });

      it('should throw an error when trying to create a player without a valid from', function () {
        const from = 'foofoo';
        return request(sails.hooks.http.app)
          .post('/players')
          .send({ to: game_number, from: from })
          .expect(400, {
            error: `Invalid from number provided: ${from}`
          })
      });
    });

    describe('Valid', function() {
      let user_id;
      const from = 'foobarbaz';
      before(function() {
        return User.create({ from: from }).then(function(user) {
          user_id = user.dataValues.id;
        });
      });

      it('should return a valid player object on create', function() {
        return request(sails.hooks.http.app)
          .post('/players')
          .send({ to: game_number, from: from })
          .expect(200)
          .expect(function(res) {
            res.body.should.have.property('id');
            res.body.should.have.property('to', game_number);
            res.body.should.have.property('from', from);
            res.body.should.have.property('avatar');
            res.body.should.have.property('user_id', user_id);
          })
      });

      it('should create a player with a default state', function () {
        const default_state = 'waiting-for-confirmation';
        return request(sails.hooks.http.app)
          .post('/players')
          .send({ to: game_number, from: from })
          .expect(200)
          .expect(function(res) {
            res.body.should.have.property('state', default_state);
          })
      });

    });

  });

  describe('find()', function() {
    const from = ''+Math.random();
    let player;
    let to;
    before(function() {
      to = game_number;

      return User.create({ from: from }).then((user) => {
        let params = {
          to: to,
          from: from
        };
        return Player.createPlayer(params);
      }).then((result) => {
        player = result;
      });
    });

    it('should return a player for a specific from and to', function() {
      return request(sails.hooks.http.app)
        .get('/players')
        .query(player)
        .expect(200)
        .expect(function(res) {
          res.body.should.have.property('id');
          res.body.should.have.property('state', default_state);
          res.body.should.have.property('from', from);
          res.body.should.have.property('to', to);
          res.body.should.have.property('avatar');
          res.body.should.have.property('nickname');
        })
    });
  });

  describe('update()', function() {
    const from = ''+Math.random();
    let player;
    let to;
    before(function() {
      to = game_number;

      return User.create({ from: from }).then(function(user) {
        let params = {
          to: to,
          from: from
        };
        return Player.createPlayer(params);
      }).then(function(result) {
        player = result;
      });
    });

    it('should update a player successfully', function(done) {
      const expected_state = 'ready-for-game';
      request(sails.hooks.http.app)
        .put(`/players/${player.id}`)
        .send({ state: expected_state })
        .expect(200)
        .end(function(err, res) {
          return Player.findOne({ where: { id: player.id }, include: [{ model: State, as: 'state' }]}).then((found_player) => {
            try {
              found_player.state.state.should.equal(expected_state);
            } catch(error) {
              err = error;
            }
            done(err);
          });
        });
    });

    it('should return an accurate player object', function() {
      const expected_state = 'ready-for-game';
      return request(sails.hooks.http.app)
        .put(`/players/${player.id}`)
        .send({ state: expected_state })
        .expect(200)
        .expect(function(res) {
          res.body.should.have.property('id');
          res.body.should.have.property('state', expected_state);
          res.body.should.have.property('from', from);
          res.body.should.have.property('to', to);
          res.body.should.have.property('avatar');
          res.body.should.have.property('nickname');
        })
    });
  });
});
