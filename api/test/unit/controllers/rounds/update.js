'use strict';
const get = require('test/support/request').get;
const post = require('test/support/request').post;
const put = require('test/support/request').put;

const User = require('models/user');
const Round = require('models/round');
const Player = require('models/player');
const Game = require('models/game');
const game_number = '+15559999999';

describe('Update', () => {
  let froms = [
    Math.random(),
    Math.random()
  ];
  let game;
  let round;

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
      return Round.create(game);
    }).then((res) => {
      round = res;
    });
  });

  it('should reject an invalid round_id', () => {
    return put({ url: `/rounds/foo` }).then((res) => {
      res.statusCode.should.equal(400);
    });
  });

  it('should reject a non existent round_id', () => {
    return put({ url: `/rounds/${Math.random()}` }).then((res) => {
      res.statusCode.should.equal(400);
    });
  });

  it('should reject an invalid game_id', () => {
    return put({ url: `/games/foo/rounds/${Math.random()}` }).then((res) => {
      res.statusCode.should.equal(400);
    });
  });

  it('should reject a non existent round_id', () => {
    return put({ url: `/games/${Math.random()}/rounds/${round.id}` }).then((res) => {
      res.statusCode.should.equal(400);
    });
  });

  it('should update a round', () => {
    const EMOJI = '😀';
    return put({ url: `/rounds/${round.id}`, data: {
      submission: EMOJI
    }}).then((res) => {
      res.statusCode.should.equal(200);
      res.body.should.have.property('id', round.id);
      res.body.should.have.property('game_id');
      res.body.should.have.property('id');
      res.body.should.have.property('players');
      res.body.should.have.property('submitter');
      res.body.should.have.property('submission', EMOJI);
      res.body.should.have.property('phrase');
      res.body.should.have.property('submission');
      res.body.should.have.property('created');
    });
  });
  
  it('should update a round with a game in the URL', () => {
    const EMOJI = '👍';
    return put({ url: `/games/${game.id}/rounds/${round.id}`, data: {
      submission: EMOJI
    }}).then((res) => {
      res.statusCode.should.equal(200);
      res.body.should.have.property('id');
      res.body.should.have.property('game_id');
      res.body.should.have.property('id');
      res.body.should.have.property('players');
      res.body.should.have.property('submitter');
      res.body.should.have.property('submission', EMOJI);
      res.body.should.have.property('phrase');
      res.body.should.have.property('submission');
      res.body.should.have.property('created');
    });
  });

  //it('should reject an invalid submission', () => {
    //const submission = 'foobar';
    //return put({ url: `/rounds/${round.id}`, data: {
      //submission: submission
    //}}).then((res) => {
      //res.statusCode.should.equal(400);
      //res.body.should.have.property('id');
      //res.body.should.have.property('game_id');
      //res.body.should.have.property('id');
      //res.body.should.have.property('players');
      //res.body.should.have.property('submitter');
      //res.body.should.have.property('phrase');
      //res.body.should.have.property('submission');
      //res.body.submission.should.not.equal(submission);
      //res.body.should.have.property('created');
    //});
  //});
});

