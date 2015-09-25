'use strict';
const squel = require('squel').useFlavour('mysql');
const Promise = require('bluebird');
const _ = require('lodash');
const EmojiData = require('emoji-data');
const punycode = require('punycode');
const regenerate = require('regenerate');

// polyfill for Array.from
require('Array.from');
const db = require('db');
const User = require('./user');
const Round = require('./round');
const all_emoji_characters = EmojiData.chars({
  include_variants: true
});
//let combiningMarks = /([\0-\u02FF\u0370-\u1DBF\u1E00-\u20CF\u2100-\uD7FF\uDC00-\uFE1F\uFE30-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF])([\u0300-\u036F\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]+)/g;
//console.log(all_emoji_characters);
/*
 *                               '⌛',
     8483,

     ,                                             */
const all_emoji_codepoints = Array.from(all_emoji_characters.join(''));

// number of guesses a user gets per round
const default_guesses = 2;
const default_clues_allowed = 1;
let Game = {
  update: function(game, data) {
    let query = squel
              .update()
              .table('games')
              .set('id', game.id)
              .where('id=?',game.id);

    if ( data.state !== undefined ) {
      let state_id = squel
                    .select()
                    .field('id')
                    .from('game_states')
                    .where('state=?',data.state);
      query.set('state_id', state_id);
    }
    if ( data.random !== undefined ) {
      query.set('random', data.random);
    }

    return db.query(query);
  },
  getNextSubmitter: function(game) {
    return Promise.join(
      Round.getLast(game),
      this.getBattingOrder(game),
      function(round, order) {
        var next;
        if ( round ) {
          for ( let i=0,l=order.length; i<l; i++ ) {
            if ( order[i].user_id === round.submitter_id ) {
              if ( i < l-1 ) {
                // grab the next one
                next = order[i + 1];
              } else {
                next = order[0];
              }
              // else, just use the first user
              break;
            }
          }
        } else {
          next = order[0];
        }
        return User.get({ id: next.user_id });
      }
    );
  },
  checkGuess: function(game, user, guess) {
    return Round.checkGuess(game, user, guess);
  },
  getGuessesLeft: function(game) {
    return Promise.all(game.round.players.map(function(player) {
      if ( player.state === 'passed' || player.state === 'lost' ) {
        return 0;
      } else {
        return Round.getGuessesLeft(game, player);
      }
    })).reduce(function(prev, current) {
      return prev + current;
    });
  },
  checkInput: function(str) {
    if ( str === '' ) { return true; }

    // Unicode Normalization, NFC form, to account for lookalikes,
    // for instance:
    // 'mañana' == 'mañana'
    // > false
    // 'ma\xF1ana' == 'man\u0303ana'
    // > false
    // https://mathiasbynens.be/notes/javascript-unicode
    //str = str.normalize('NFC');

    // ES6 Array uses string iterator to split string by symbol
    //console.log('str', str);
    //str = Array.from(str);
    //console.log(punycode.ucs2.decode('💩'));
    //console.log(punycode.ucs2.encode([0x1D306]));
    //console.log(punycode.ucs2.decode('\u231b\ufe0f'));
    //console.log(punycode.ucs2.decode(str));
    //function countSymbols(string) {
      //return punycode.ucs2.decode(string).length;
    //}
    //console.log(countSymbols('💩'));
    //console.log(countSymbols('⌛️'));
    //console.log( 'puny: ', punycode.ucs2.decode(str));
    //console.log(punycode.ucs2.decode('💩'));
    //console.log(punycode.ucs2.decode('⌛️'));
    //console.log('str', str.length);
    //console.log('str', str);
    //let regex = regenerate()
    //.addRange(0x0, 0x10FFFF) ;    // all
    //console.log(regex.toRegExp());
  
    console.log(str);
    let combiningMarks = /([\0-\u02FF\u0370-\u1DBF\u1E00-\u20CF\u2100-\uD7FF\uDC00-\uFE1F\uFE30-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF])([\u0300-\u036F\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]+)/g;
    combiningMarks = /([\uFE0F])/g;
    //let stripCombiningMarks = require('strip-combining-marks');
    //str = stripCombiningMarks(str);
    str = str.replace(combiningMarks, '');
    console.log(str);
    console.log(punycode.ucs2.decode(str));
    let regex = regenerate(all_emoji_codepoints);
    //console.log(regenerate('⌛'));
    //console.log(regex);
    let result = str.replace(regex.toRegExp(),'');
    return result.length === 0;
    /*
    str = str.replace(FBS_REGEXP, '').trim();
    if ( str.length > 0 ) {
      // this means non-emoji characters exist in the string
      return false;
    } else {
      return true;
    }
    */
  },
  saveSubmission: function(user, message) {
    return this.get({ user: user }).then(function(game) {
      return Round.saveSubmission(game, user, message).then(function() {
        return game;
      });
    });
  },
  newRound: function(game) {
    return Round.create(game).then(function(round) {
      return Promise.all(round.players.map(function(player) {
        var state;
        if ( player === round.submitter ) {
          state = 'waiting-for-submission';
        } else {
          state = 'waiting-for-round';
        }
        return User.update(player, {
          state: state,
        });
      })).then(function() {
        return round;
      });
    });
  },
  getPhrase: function(game) {
    let game_phrases = squel
                       .select()
                       .field('phrase_id')
                       .from('game_phrases')
                       .where('game_id=?', game.id);
    let query = squel
                .select()
                .from('phrases', 'p')
                .field('p.phrase')
                .field('p.id')
                .where('p.id NOT IN ?', game_phrases)
                .order('p.id')
                .limit(1);

    return db.query(query).then(function(rows) {
      if ( rows ) {
        let phrase = rows[0];
        // mark this phrase as used
        let markPhrase = squel
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
  getPlayers: function(game) {
    let query = squel
                .select()
                .field('u.id')
                .field('u.created')
                .field('s.state')
                .field('p.platform as platform')
                .from('game_participants', 'gp')
                .left_join('games', 'g', 'gp.game_id = g.id')
                .left_join('users', 'u', 'u.id = gp.user_id')
                .left_join('user_states', 's', 's.id = u.state_id')
                .left_join('platforms', 'p', 'p.id = u.platform_id')
                .where('g.id=?', game.id)
                .order('u.id');

    return db.query(query).then(function(users) {
      return Promise.all(users.map(function(user) {
        let query = squel
                    .select()
                    .field('a.attribute')
                    .field('k.`key`')
                    .from('user_attributes', 'a')
                    .left_join('users', 'u', 'u.id = a.user_id')
                    .left_join('user_attribute_keys', 'k', 'k.id = a.attribute_id')
                    //.where('k.`key`=?', key)
                    //.where('a.attribute=?', val)
                    .where('a.user_id=?',user.id);

        return Promise.join(
          db.query(query),
          function(attributes) {
            attributes.map(function(attribute) {
              user[attribute.key] = attribute.attribute;
            });
            return user;
          }
        );
      }.bind(this)));

    }.bind(this));
  },
  getRound: function(game) {
    return Round.getLast(game);
  },
  get: function(params) {
    let query = squel
                .select()
                .field('g.id')
                .field('g.random')
                .field('s.state')
                .from('games', 'g')
                .left_join('game_participants', 'p', 'p.game_id = g.id')
                .left_join('game_states', 's', 's.id = g.state_id')
                .order('g.created', false)
                .limit(1);

    if ( params.user ) {
      query.where('p.user_id=?',params.user.id);
    } else if ( params.users ) {
      let user_ids = params.users.map(function(user) {
        return user.id;
      });
      query.where('p.user_id IN ? ',user_ids);
    } else if ( params.id ) {
      query.where('g.id=?',params.id);
    }
    
    return db.query(query.toString()).then(function(rows) {
      if ( rows.length ) {
        let game = rows[0];
        return this.getRound(game).then(function(round) {
          game.round = round;
          return this.getPlayers(game).then(function(players) {
            game.players = players;

            if ( game.round ) {
              game.players.map(function(player) {
                if ( player.id === game.round.submitter_id ) {
                  game.round.submitter = player;
                } else {
                  if ( ! game.round.players ) { game.round.players = []; }
                  game.round.players.push(player);
                }
              });
            }
            return game;
          });
        }.bind(this));
      } else {
        return null;
      }
    }.bind(this));
  },
  start: function(game) {
    this.update(game, {
      state: 'playing'
    });
    return this.generateBattingOrder(game);
  },
  getBattingOrder: function(game) {
    let query = squel
                .select({ autoQuoteFieldNames: true })
                .field('user_id')
                .field('order')
                .from('player_order')
                .where('game_id=?',game.id);
    return db.query(query);
  },
  addToBattingOrder: function(game, user) {
    return this.getBattingOrder(game).then(function(order) {
      let nextOrder;
      if ( order.length ) {
        nextOrder = order.pop().order + 1;
      } else {
        nextOrder = 0;
      }
      return this.addBatter(game, user, nextOrder);
    }.bind(this));
  },
  generateBattingOrder: function(game) {
    return this.getPlayers(game).then(function(players) {
      return Promise.all(_.shuffle(players).map(function(player, i) {
        return this.addBatter(game, player, i);
      }.bind(this)));
    }.bind(this));
  },
  addBatter: function(game, player, order) {
    let query = squel
                .insert({ autoQuoteFieldNames: true })
                .into('player_order')
                .setFields({
                  game_id: game.id,
                  user_id: player.id,
                  order: order
                });
    return db.query(query);
  },
  add: function(game, users) {
    return Promise.all(users.map(function(user) {
      let row = {
        game_id: game.id,
        user_id: user.id
      };

      let query = squel
                  .insert()
                  .into('game_participants')
                  .setFields(row);

      return db.query(query).then(function(rows) {
        return {
          id: rows.insertId
        };
      }).then(function() {
        //if ( game.state && game.state !== 'waiting-for-players' ) {
          // game is in progress
          this.addToBattingOrder(game, user).then(function() {
          }).catch(function(err) {
            console.error('error adding user ot batting order',  user, err);
          });
        //}
      }.bind(this));
    }.bind(this)));
  },
  create: function() {
    let state_id = squel
                  .select()
                  .field('id')
                  .from('game_states')
                  .where('state=?','pending');

    let query = squel
                .insert()
                .into('games', 'g')
                .setFields({
                  state_id: state_id,
                  guesses: default_guesses,
                  clues_allowed: default_clues_allowed 
                });
    return db.query(query.toString()).then(function(rows) {
      return {
        id: rows.insertId
      };
    });
  }
};

module.exports = Game;
