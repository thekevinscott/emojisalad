'use strict';
const squel = require('squel').useFlavour('mysql');
const db = require('db');
const Promise = require('bluebird');
const _ = require('lodash');
const emojiExists = require('emoji-exists');
const EmojiData = require('emoji-data');

const Player = require('./player');
const User = require('./user');
const Round = require('./round');
//const Round = require('./round');

// number of guesses a player gets per round
//const default_guesses = 2;
//const default_clues_allowed = 1;
const registry = require('microservice-registry');
const request = Promise.promisify(require('request'));

squel.registerValueHandler(Date, (date) => {
  return '"' + date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + '"';
});

const Game = {
  create: (users) => {
    console.info('create a game with these users', users);
    function getValidUsers(users) {
      return users.filter(user => parseInt(user.id));
    }
    if ( !_.isArray(users) ) {
      throw new Error("You must provide an array of users");
    } else if ( getValidUsers(users).length !== users.length ) {
      // check to see if every user has a valid ID
      //console.error('invalid parsed ids');
      throw new Error("You must provide a valid user");
    } else {
      console.info('users that we will now check', users);
      // check that every user is valid
      return Promise.all(users.map((user) => {
        console.info('check that this user is valid', user);
        return User.findOne(user.id).then((result) => {

          return new Promise((resolve, reject) => {
            if ( user.to ) {
              console.info('a to exists');
              resolve(user.to);
            } else {
              console.info('user players', user);
              const player_sender_ids = result.players.map((player) => {
                return player.to;
              });
              const service = registry.get(result.protocol);
              const options = {
                url: service.api.senders.get.endpoint,
                method: service.api.senders.get.method,
                qs: {
                  exclude: player_sender_ids.join(',')
                }
              };

              return request(options).then((response) => {
                //console.info('response', response);
                try {
                  return JSON.parse(response.body);
                } catch(err) {
                  console.error('error parsing json response', response.body);
                  reject(new Error('Error getting sender'));
                }
              }).then((body) => {
                resolve(body.id);
              });
            }
          }).then((sender) => {
            return Object.assign({}, result, {
              to: sender
            });
          });
        });
      })).then((rows) => {
        console.info('users that have been checked', rows);
        if ( getValidUsers(rows).length !== users.length ) {
          console.error('invalid queried ids');
          throw new Error("You must provide a valid user");
        } else {
          console.info('the rows', rows);
          rows.map((user) => {
            user.players.map((player) => {
              if ( player.to === user.to ) {
                throw new Error("A player already exists for this game number");
              }
            });
          });
          return rows;
        }
      }).then((valid_users) => {
        console.info('the valid users', valid_users);
        const query = squel
                      .insert()
                      .into('games', 'g')
                      .setFields({
                        //clues_allowed: default_clues_allowed,
                        created: squel.fval('NOW(3)'),
                        last_activity: squel.fval('NOW(3)')
                      });

        return db.create(query).then((game) => {
          if ( ! game || ! game.insertId ) {
            //console.error(query.toString());
            throw new Error("There was an error inserting game");
          } else {
            console.info('now add users ot game', valid_users, game);
            return Game.add({
              id: game.insertId
            }, valid_users);
          }
        });
      });
    }
  },
  getNextSubmitter: (game_params) => {
    //console.info('get next submitter!');
    console.info('get next submitter', game_params);
    return Promise.join(
      Round.findOne({ game_id: game_params.id, most_recent: true }),
      Game.findOne(game_params),
      (round, game) => {
        console.info('game', game);
        const players = game.players;
        console.info('game get next submitter', round, players);
        let next;
        //if ( round ) {
        if ( round && round.id ) {
          console.info('round exists, the players are', players, 'the submitter is', round.submitter);
          for ( let i=0,l=players.length; i<l; i++ ) {
            if ( players[i].id === round.submitter.id ) {
              console.info('there is a match!', round.submitter.id);
              if ( i < l-1 ) {
                console.info('grab the next one');
                // grab the next one
                next = players[i + 1];
              } else {
                console.info('go to 0');
                next = players[0];
              }
              // else, just use the first player
              break;
            }
          }
        } else if ( players.length ) {
          console.info('theres no round');
          next = players[0];
        } else {
          throw new Error('wtf, no round and no players');
        }
        return Player.findOne({ id: next.id }).then((player) => {
          console.info('next', player);
          return player;
        });
      }
    );
  },
  checkInput: (str) => {
    if ( str === '' ) {
      return 'text';
    } else if ( emojiExists(str) ) {
      return 'emoji';
    } else if ( EmojiData.scan(str).length > 0 ) {
      return 'mixed-emoji';
    } else {
      return 'text';
    }
  },
  //getPhrase: (game) => {
    //console.log('time to GET THAT PHRASE');
    //const game_phrases = squel
                         //.select()
                         //.field('phrase_id')
                         //.from('game_phrases')
                         //.where('game_id=?', game.id);
    //const query = squel
                  //.select()
                  //.from('phrases', 'p')
                  //.field('p.phrase')
                  //.field('p.id')
                  //.where('p.id NOT IN ?', game_phrases)
                  //.order('p.id')
                  //.limit(1);

    //console.log(query.toString());
    //return db.query(query).then((rows) => {
      //if ( rows ) {
        //const phrase = rows[0];
        //const markPhrase = squel
                           //.insert()
                           //.into('game_phrases')
                           //.setFields({
                             //game_id: game.id,
                             //phrase_id: phrase.id
                           //});
        //db.query(markPhrase);
        //return phrase;
      //} else {
        //console.error('Uh oh, out of phrases');
      //}
    //});
  //},
  add: (game, users) => {
    console.info('get ready to add users to game', game, users);
    //console.debug('huzzah add');
    return new Promise((resolve) => {
      resolve();
    }).then(() => {
      if ( !game.id ) {
        return Game.findOne(game);
      } else {
        return Game.findOne(game.id);
      }
    }).then((game) => {
      console.info('found teh game', game, users);
      return Promise.all(users.map((user) => {
        if ( !user.to ) {
          console.error(user);
          throw new Error('Why is there no user `to` here');
        }
        const player_params = {
          game_id: game.id,
          user_id: user.id,
          to: user.to
        };
        console.info('prepare to create player', player_params);
        return Player.create(player_params).catch((err) => {
          console.info('did not create player', err);
          throw new Error('Did not create player', player_params);
          return null;
        });
      })).then((players) => {
        //console.info('players created', players);
        game.players = game.players.concat(players.filter(player => player));
        return game;
      });
    }).then((game) => {
      //if ( game.players.length > 1 && game.round === null ) {
        //return Round.create(game).then((round) => {
          //game.round = round;
          //game.round_count = 1;
          //return game;
        //});
      //} else {
        //return game;
      //}
      return game;
    });
  },
  findOne: (params) => {
    //console.info('prepare to find a single game', params);
    if (parseInt(params)) {
      params = { id: params };
    }
    return Game.find(params).then((games) => {
      if ( games && games.length) {
        return games[0];
      } else {
        return {};
      }
    });
  },
  find: (params = {}) => {
    //console.info('find game');
    const rounds = squel
                   .select()
                   .from('rounds')
                   .order('id', false);

    let query = squel
                .select()
                .field('g.id')
                .field('g.created')
                .field('r.id', 'round_id')
                .field('COUNT(r.id)', 'round_count')
                .left_join(rounds, 'r', 'r.game_id=g.id')
                .group('g.id')
                //.group('r.id')
                .from('games', 'g');

    if ( params.id ) {
      query = query.where('g.id=?',params.id);
    }
    //console.info('find game 2');

    if ( params.player_id ) {
      query = query
              .field('p.id','player_id')
              .left_join('players', 'p', 'p.game_id=g.id')
              .where('p.id=?',params.player_id);
    } else if ( params.player_ids ) {
      query = query
              .field('p.id','player_id')
              .left_join('players', 'p', 'p.game_id=g.id')
              .where('p.id IN ?',params.player_ids);
    } else if (params.user_id) {
      query = query
              .field('p.id','player_id')
              .left_join('players', 'p', 'p.game_id=g.id')
              .left_join('users', 'u', 'u.id=p.user_id')
              .where('u.id=?',params.user_id);
    }

    const getByGameID = (arr) => {
      return arr.reduce((obj, el) => {
        const game_id = el.game_id;
        delete el.game_id;
        if ( ! obj[game_id] ) {
          obj[game_id] = [];
        }
        obj[game_id].push(el);
        return obj;
      }, {});
    };

    console.info('api query', query.toString());

    return db.query(query).then((games) => {
      //console.info('return from games');
      if ( games && games.length ) {
        const game_ids = games.map(game => game.id);
        return Promise.join(
          Player.find({ game_ids }).then(getByGameID),
          Round.find({ game_ids, most_recent: true }).then(getByGameID),
          (players = {}, rounds = {}) => {
            //console.info('found games');
            return games.map((game) => {
              const round = ( rounds && rounds[game.id] ) ? rounds[game.id].pop() : null;
              return {
                id: game.id,
                created: game.created,
                players: players[game.id] || [],
                round_count: game.round_count,
                round
              };
            });
          }
        );
      } else {
        return [];
      }
    });
  }
};

module.exports = Game;
