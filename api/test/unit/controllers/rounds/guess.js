'use strict';
const post = require('test/support/request').post;
const put = require('test/support/request').put;

const User = require('models/user');
const Round = require('models/round');
const EMOJI = '👍';
const protocol = 'testqueue';

describe('Guess', () => {
  const froms = [
    Math.random(),
    Math.random()
  ];
  let game;
  let round;

  before(() => {
    return Promise.all(froms.map((from) => {
      return User.create({ from, protocol });
    })).then((users) => {
      const payload = { users };
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

  describe('Invalid', () => {
    it('should reject an invalid round_id', () => {
      return post({ url: `/rounds/foo/guess` }).then((res) => {
        res.statusCode.should.equal(400);
      });
    });

    it('should reject a non existent round_id', () => {
      return post({ url: `/rounds/${Math.random()}/guess` }).then((res) => {
        res.statusCode.should.equal(400);
      });
    });

    it('should reject an invalid game_id', () => {
      return post({ url: `/games/foo/rounds/${Math.random()}/guess` }).then((res) => {
        res.statusCode.should.equal(400);
      });
    });

    it('should reject a non existent round_id', () => {
      return post({ url: `/games/${Math.random()}/rounds/${round.id}/guess` }).then((res) => {
        res.statusCode.should.equal(400);
      });
    });

    it('should not be able to guess without a guess argument', () => {
      //const guess = 'foobar';
      return post({ url: `/rounds/${round.id}/guess`, data: {
        player_id: 'foo'
      }}).then((res) => {
        res.statusCode.should.equal(400);
      });
    });

    it('should not be able to guess without a valid submission', () => {
      const guess = 'foobar';
      return post({ url: `/rounds/${round.id}/guess`, data: {
        guess
      }}).then((res) => {
        res.statusCode.should.equal(400);
      });
    });

    it('should not be able to guess without a player id', () => {
      const guess = 'foobar';
      return put({ url: `/rounds/${round.id}`, data: {
        submission: EMOJI
      }}).then(() => {
        return post({ url: `/rounds/${round.id}/guess`, data: {
          guess
        }});
      }).then((res) => {
        res.statusCode.should.equal(400);
      });
    });

    it('should not be able to guess with an invalid player id', () => {
      const guess = 'foobar';
      return put({ url: `/rounds/${round.id}`, data: {
        submission: EMOJI
      }}).then(() => {
        return post({ url: `/rounds/${round.id}/guess`, data: {
          guess,
          player_id: 'foo'
        }});
      }).then((res) => {
        res.statusCode.should.equal(400);
      });
    });

    it('should not be able to guess without a valid player id', () => {
      const guess = 'foobar';
      return put({ url: `/rounds/${round.id}`, data: {
        submission: EMOJI
      }}).then(() => {
        return post({ url: `/rounds/${round.id}/guess`, data: {
          guess,
          player_id: Math.random()
        }});
      }).then((res) => {
        res.statusCode.should.equal(400);
      });
    });
  });

  describe('Valid', () => {
    let round;

    beforeEach(() => {
      return Round.create(game).then((round) => {
        return put({ url: `/rounds/${round.id}`, data: {
          submission: EMOJI
        }});
      }).then((res) => {
        round = res.body;
      });
    });

    it('should record incorrect guesses', () => {
      const guess = 'foo';
      return post({ url: `/rounds/${round.id}/guess`, data: {
        guess,
        player_id: round.players[0].id
      }}).then((res) => {
        res.statusCode.should.equal(200);
        res.body.should.have.property('id', round.id);
        res.body.should.have.property('winner', null);
        res.body.should.have.property('guesses');
        res.body.guesses.length.should.equal(1);
      });
    });

    it('should guess correctly for a round', () => {
      const guess = round.phrase;
      return post({ url: `/rounds/${round.id}/guess`, data: {
        guess,
        player_id: round.players[0].id
      }}).then((res) => {
        res.statusCode.should.equal(200);
        res.body.should.have.property('id', round.id);
        res.body.should.have.property('winner');
        res.body.should.have.property('guesses');
        res.body.guesses.length.should.equal(1);
        res.body.winner.id.should.equal(round.players[0].id);
      });
    });
    it('should guess correctly for a round with a game in the URL', () => {
      const guess = round.phrase;
      return post({ url: `/games/${game.id}/rounds/${round.id}/guess`, data: {
        guess,
        player_id: round.players[0].id
      }}).then((res) => {
        res.statusCode.should.equal(200);
        res.body.should.have.property('id', round.id);
        res.body.should.have.property('winner');
        res.body.should.have.property('guesses');
        res.body.guesses.length.should.equal(1);
        res.body.winner.id.should.equal(round.players[0].id);
      });
    });
  });
});
