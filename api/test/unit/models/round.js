'use strict';
const squel = require('squel');
const should = require('chai').should();
const db = require('db');
const proxyquire = require('proxyquire');
const User = require('models/User');
const post = require('test/support/request').post;
const Promise = require('bluebird');
const protocol = 'testqueue';
const Round = proxyquire('models/Round', {
  autosuggest: () => {
    return new Promise((resolve) => {
      resolve([]);
    });
  }
});
const EMOJI = '👍';

describe('Round Model', () => {
  const phrases = {};

  before(() => {
    const query = squel
                  .select()
                  .field('id')
                  .field('phrase')
                  .from('phrases');

    return db.query(query).then((rows) => {
      rows.map((row) => {
        phrases[row.phrase] = row.id;
      });
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
          from: user,
          protocol
        });
      })).then((users) => {
        const payload = { users };
        return post({
          url: '/games',
          data: payload
        });
      }).then((res) => {
        const game = res.body;
        return Round.create({ id: game.id });
      }).then((res) => {
        round = res;
      });
    });

    const guess = (the_guess, phrase_id, correct = true) => {
      return Round.update(round, { submission: EMOJI, phrase_id }).then(() => {
        return Round.findOne({ id: round.id });
      }).then((result) => {
        round = result;
        return Round.guess(round, round.players[0], the_guess);
      }).then((round) => {
        round.should.have.property('winner');
        round.should.have.property('guesses');
        if ( correct ) {
          round.should.have.property('winner');
          should.exist(round.winner);
          round.winner.should.have.property('id', round.players[0].id);
        } else {
          round.should.have.property('winner', null);
        }
        return round;
      });
    };

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
      return guess('SILENCE OF THE LAMBS', phrases['SILENCE OF THE LAMBS'] );
    });

    it('should accept a guess missing ignored words', () => {
      return guess('SILENCE LAMBS', phrases['SILENCE OF THE LAMBS'] );
    });

    it('should accept a trimmed guess', () => {
      return guess('SILENCE OF THE LAMB', phrases['SILENCE OF THE LAMBS'] );
    });

    it('should accept a truncated guess', () => {
      return guess('SILEN OF THE LAMBS', phrases['SILENCE OF THE LAMBS'] );
    });

    it('should accept a longer guess', () => {
      return guess('SILENCE OF THE LAMBS 1', phrases['SILENCE OF THE LAMBS'] );
    });

    it('should accept a way longer guess', () => {
      return guess('SILENCE OF THE LAMBS 123', phrases['SILENCE OF THE LAMBS'] );
    });

    it('should ignore all punctuation', () => {
      return guess('SILENCE !@#$%^&*()-=_+~`,./?><\'";:[]{}|\ LAMBS', phrases['SILENCE OF THE LAMBS'] );
    });

    it('should not pass for absurdly short phrases', () => {
      return guess('m', phrases['MAD MEN'], false);
    });

    it('should not pass shorter phrases', () => {
      return guess('foo', phrases['MAD MEN'], false);
    });

    it('should not pass close but short phrases', () => {
      return guess('mad', phrases['MAD MEN'], false);
    });

    it('should pass pretty close short phrases', () => {
      return guess('mad man', phrases['MAD MEN'], true);
    });

    it('should not accept an absurdly long phrase', () => {
      const the_guess = 'SILENCE OF THE LAMBS i think';
      return guess(the_guess, phrases['SILENCE OF THE LAMBS'], false).then((result) => {
        result.should.have.property('winner', null);
        result.should.have.property('guesses');
        result.guesses.length.should.equal(1);
      });
    });

    it('should be able to parse doctor', () => {
      const the_guess = 'Dr who';
      return guess(the_guess, phrases['DOCTOR WHO'], true);
    });
  });
});
