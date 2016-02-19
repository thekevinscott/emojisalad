'use strict';
const squel = require('squel');
const db = require('db');
const proxyquire = require('proxyquire');
const User = require('models/User');
const post = require('test/support/request').post;
const Promise = require('bluebird');
const Round = proxyquire('models/Round', {
  autosuggest: (guess) => {
    return new Promise((resolve) => {
      resolve([]);
    });
  }
});
const EMOJI = '👍';

describe('Round', () => {
  let phrase_id;
  before(() => {
    const query = squel
                  .select()
                  .field('id')
                  .from('phrases')
                  .where('phrase="SILENCE OF THE LAMBS"');
    return db.query(query).then((rows) => {
      phrase_id = rows[0].id;
    });
  });

  describe('parsePhrase', () => {
    it('should trim whitespace', () => {
      Round.parsePhrase('         foo       ').should.equal('foo');
    });
    it('should strip out ignored words', () => {
      Round.parsePhrase('the of an foo an a for and ').should.equal('foo');
    });
  });
  describe('guess', () => {
    let round;

    beforeEach(() => {
      const users = [
        Math.random(),
        Math.random()
      ];

      return Promise.all(users.map((user) => {
        return User.create({
          from: user
        });
      })).then((users) => {
        const payload = { users: users };
        return post({
          url: '/games',
          data: payload
        });
      }).then((res) => {
        const game = res.body;
        return Round.create({ id: game.id });
      }).then((res) => {
        return Round.update(res, { submission: EMOJI, phrase_id: phrase_id });
      }).then((res) => {
        round = res;
      });
    });

    const guess = (the_guess, data) => {
      return Round.guess(round, round.players[0], the_guess).then((round) => {
        round.should.have.property('winner');
        round.should.have.property('guesses');
        round.winner.should.have.property('id', round.players[0].id);
        return round;
      });
    }

    it('should pass the exact guess', () => {
      const the_guess = round.phrase;
      return guess(the_guess).then((round) => {
        round.guesses.pop().should.have.property('guess', the_guess);
      });
    });

    it('should be case insensitive', () => {
      const the_guess = round.phrase;
      return guess(the_guess.toLowerCase());
    });

    it('should pass the exact round phrase', () => {
      return guess('SILENCE OF THE LAMBS', { phrase_id: phrase_id });
    });

    it('should accept a guess missing ignored words', () => {
      return guess('SILENCE LAMBS', { phrase_id: phrase_id });
    });

    it('should accept a trimmed guess', () => {
      return guess('SILENCE OF THE LAMB', { phrase_id: phrase_id });
    });

    it('should accept a truncated guess', () => {
      return guess('SILEN OF THE LAMBS', { phrase_id: phrase_id });
    });

    it('should accept a longer guess', () => {
      return guess('SILENCE OF THE LAMBS 1', { phrase_id: phrase_id });
    });

    it('should accept a way longer guess', () => {
      return guess('SILENCE OF THE LAMBS 12345', { phrase_id: phrase_id });
    });

    it('should not accept an absurdly long phrase', () => {
      const the_guess = 'SILENCE OF THE LAMBS i think';
      return Round.guess(round, round.players[0], the_guess).then((round) => {
        round.should.have.property('winner', null);
        round.should.have.property('guesses');
        round.guesses.length.should.equal(1);
      });
    });
  });
});
