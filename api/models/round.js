var _ = require('lodash');
var squel = require('squel');
var Promise = require('bluebird');

var db = require('db');

var User;
var Message = require('./message');
var Game;

var Round = {
  checkGuess: function(game, user, guess) {
    var query = squel
                .select()
                .from('phrases')
                .where('id=?', game.round.phrase_id);
                        
                //console.log('game round', game.round);
    return db.query(query.toString()).then(function(phrases) {
      var phrase = phrases[0].phrase;
      var regex = new RegExp('^'+phrase, 'i');
      console.log('regex', regex, guess);
      var result = regex.test(guess);

      // we save the guess
      var guessQuery = squel
                       .insert()
                       .into('guesses')
                       .setFields({
                         user_id: user.id,
                         round_id: game.round.id,
                         correct: (result) ? 1 : 0,
                         guess: guess
                       });
      db.query(guessQuery.toString());

      if ( result ) {
        var state_id = squel
                       .select()
                       .field('id')
                       .from('round_states')
                       .where('state=?', 'won');

        var query = squel
                    .update()
                    .table('rounds')
                    .set('winner_id',user.id)
                    .set('state_id',state_id)
                    .where('id=?',game.round.id);
        return db.query(query.toString()).then(function() {
          return true;
        });
      } else {
        return false;
      }
    });

  },
  getGuessesLeft: function(game, user) {
    var query = squel
                .select()
                .field('count(1) as guesses_made')
                .field('r.guesses')
                .from('rounds', 'r')
                .left_join('guesses', 'g', 'g.round_id=r.id')
                .where('r.id=?',game.round.id)
                .where('g.user_id=?',user.id);

                //console.log(query.toString());
    return db.query(query).then(function(rows) {
      var row = rows.pop();
      return parseInt(row.guesses) - parseInt(row.guesses_made);
    });
  },
  getPhrase: function(game) {
    if ( ! Game ) {
      Game = require('./game');
    }
    var game_phrases = squel
                       .select()
                       .field('phrase_id')
                       .from('game_phrases')
                       .where('game_id=?', game.id);
    var query = squel
                .select()
                .from('phrases', 'p')
                .field('p.phrase')
                .field('p.id')
                .where('p.id NOT IN ?', game_phrases)
                .order('p.id')
                .limit(1);

    return db.query(query).then(function(rows) {
      if ( rows ) {
        var phrase = rows[0];
        // mark this phrase as used
        var markPhrase = squel
                         .insert()
                         .into('game_phrases')
                         .setFields({
                           game_id: game.id,
                           phrase_id: phrase.id
                         });
        db.query(markPhrase);
        return phrase;
      } else {
        console.error('Uh oh, out of phrases');
      }
    });
  },
  getLast: function(game) {
    var query = squel
                .select()
                .field('r.id')
                .field('r.submitter_id')
                .field('r.phrase_id')
                .field('r.winner_id')
                .field('r.created')
                .field('r.guesses')
                //.field('COUNT(1) as guesses_made')
                .field('p.phrase')
                .field('s.state')
                .from('rounds', 'r')
                //.left_join('guesses', 'g', 'g.round_id=r.id')
                .left_join('round_states', 's', 's.id=r.state_id')
                .left_join('phrases', 'p', 'p.id=r.phrase_id')
                .where('r.game_id=?',game.id)
                .order('r.id', false)
                //.group('r.id')
                .limit(1);
                        
    return db.query(query).then(function(rounds) {
      if ( rounds.length ) {
        var round = rounds[0];
        //round.guesses_left = round.guesses - round.guesses_made;
        //delete round.guesses_made;
        return round;
      } else {
        return null;
      }
    });
  },
  create: function(game) {
    if ( ! Game ) {
      Game = require('./game');
    }

    return Promise.join(
      Game.getNextSubmitter(game),
      this.getPhrase(game),
      function(submitter, phrase) {
        var state = 'pending';
        var state_id = squel
                       .select()
                       .field('id')
                       .from('round_states')
                       .where('state=?',state);

        var guesses = squel
                      .select()
                      .field('guesses')
                      .from('games')
                      .where('id=?',game.id);

        var query = squel
                    .insert()
                    .into('rounds')
                    .setFields({
                      game_id: game.id,
                      state_id: state_id,
                      submitter_id: submitter.id,
                      phrase_id: phrase.id,
                      guesses: guesses
                    });
        return db.query(query.toString()).then(function() {
          return {
            phrase: phrase.phrase,
            submitter: submitter,
            game: game,
            state: state,
            players: game.players.filter(function(player) {
              if ( player.id !== submitter.id ) {
                return player;
              }
            })
          }
        });
      }
    );
  },
  saveSubmission: function(game, user, message) {
    console.log('SUBMISSION IS ABOUT TO BE SAVED');
    if ( ! User ) {
      User = require('./user');
    }

    //console.log('game', game.round);
    //console.log('incoming user', user);
    // all other users who are not submitter (not the user)
    // should be switched to guessing
    if ( game.round.players[0].id === user.id ) {
      throw "These should not match";
    }
    var promises = game.round.players.map(function(player) {
      //console.log('player', player.id, 'guessing update');
      return User.update(player, {state: 'guessing' });
    });
    promises.push(function() {
      return User.update(user, {state: 'submitted'})
    }());
    //console.log('get ready to push a promise #####\n\n\n\n\n');
    promises.push(function() {
      //console.log('update round', this, game.round);
      return this.update(game.round, { state: 'playing' });
    }.bind(this)());
    return Promise.all(promises);
  },
  update: function(round, data) {
    var query = squel
                .update()
                .table('rounds', 'r')
                .where('r.id=?',round.id);
    if ( data.state ) {
      var state_id = squel
                     .select()
                     .field('id')
                     .from('round_states')
                     .where('state=?',data.state);
      query.set('state_id', state_id);
    }

    console.log('query', query.toString());
    return db.query(query.toString());
  }
}

module.exports = Round;
