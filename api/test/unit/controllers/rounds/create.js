'use strict';
const get = require('test/support/request').get;
const post = require('test/support/request').post;

const User = require('models/user');
const Round = require('models/round');
const Player = require('models/player');
const Game = require('models/game');
const game_number = '+15559999999';

describe('Create', () => {
  let froms = [
    Math.random(),
    Math.random()
  ];
  let game;

  before(() => {
    return Promise.all(froms.map((from) => {
      return User.create({ from: from });
    })).then((users) => {
      const payload = { users: users };
      return post({
        url: '/games',
        data: payload
      });
    }).then((res) => {
      game = res.body;
    });
  });

  it('should reject an invalid game_id', () => {
    return post({ url: `/games/foo/rounds` }).then((res) => {
      res.statusCode.should.equal(400);
    });
  });

  it('should reject a non existent game_id', () => {
    return post({ url: `/games/${Math.random()}/rounds` }).then((res) => {
      res.statusCode.should.equal(400);
    });
  });


  it('should return rounds for a game', () => {
    return post({ url: `/games/${game.id}/rounds` }).then((res) => {
      res.statusCode.should.equal(200);
      res.body.should.have.property('id');
      res.body.should.have.property('game_id');
      res.body.should.have.property('id');
      res.body.should.have.property('players');
      res.body.should.have.property('submitter');
      res.body.should.have.property('phrase');
      res.body.should.have.property('created');
    });
  });
});

