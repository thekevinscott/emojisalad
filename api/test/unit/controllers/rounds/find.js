
const get = require('test/support/request').get;
const post = require('test/support/request').post;

const User = require('models/user');
const Round = require('models/round');
const Player = require('models/player');
const Game = require('models/game');
const game_number = '+15559999999';
describe('Find', () => {
  let froms = [[
    Math.random(),
    Math.random()
  ], [
    Math.random(),
    Math.random()
  ], [
    Math.random(),
    Math.random()
  ]];
  let games = [];

  before(() => {
    return Promise.all(froms.map((from_array) => {
      return Promise.all(from_array.map((from) => {
        return User.create({ from: from });
      })).then((users) => {
        const payload = { users: users };
        return post({
          url: '/games',
          data: payload
        });
      });
    })).then((reses) => {
      return reses.map((res) => {
        games.push(res.body.id);
      });
    }).then(() => {
      return Round.create({ id: games[0] });
    });
  });

  it('should reject an invalid game_id', () => {
    return get({ url: `/games/foo/rounds` }).then((res) => {
      res.statusCode.should.equal(400);
    });
  });

  it('should reject a non existent game_id', () => {
    return get({ url: `/games/${Math.random()}/rounds` }).then((res) => {
      res.statusCode.should.equal(400);
    });
  });


  it('should return rounds for a game', () => {
    return get({ url: `/games/${games[0]}/rounds` }).then((res) => {
      res.statusCode.should.equal(200);
      res.body.length.should.equal(2);
      res.body[0].should.have.property('id');
      res.body[0].should.have.property('players');
      res.body[0].should.have.property('submitter');
      res.body[0].should.have.property('phrase');
      res.body[0].should.have.property('created');

      for ( let i=1; i<res.body.length; i++ ) {
        res.body[i].id.should.be.above(res.body[i-1].id);
      }
    });
  });

  it('should ignore game_ids if selecting by a game id', () => {
    return get({ url: `/games/${games[0]}/rounds`, data: { game_ids: 'foo' }}).then((res) => {
      res.statusCode.should.equal(200);
      res.body.length.should.equal(2);
    });
  });

  it('should return rounds for multiple games', function() {
    return get({ url: `/rounds`, data: { game_ids: [ games[0], games[1] ] }}).then((res) => {
      res.statusCode.should.equal(200);
      res.body.length.should.equal(3);
      res.body[0].should.have.property('id');
      res.body[0].should.have.property('players');
      res.body[0].should.have.property('submitter');
      res.body[0].should.have.property('phrase');
      res.body[0].should.have.property('created');
    });
  });

  it('should return only the latest round for a game', function() {
    return get({ url: `/games/${games[0]}/rounds` }).then((res) => {
      res.body.length.should.equal(2);
      const last_round = res.body.pop();
      return get({ url: `/games/${games[0]}/rounds`, data: { most_recent: true }}).then((res) => {
        res.statusCode.should.equal(200);
        res.body.length.should.equal(1);
        res.body[0].should.have.property('id', last_round.id);
        res.body[0].should.have.property('players');
        res.body[0].players.should.deep.equal(last_round.players);
        res.body[0].should.have.property('submitter', last_round.submitter);
        res.body[0].should.have.property('phrase', last_round.phrase);
        res.body[0].should.have.property('created', last_round.created);
      });
    });
  });
});

