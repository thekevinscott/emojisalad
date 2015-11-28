'use strict';
const squel = require('squel').useFlavour('mysql');
const db = require('db');
const Promise = require('bluebird');
let Game;

let Player = {
  // valid phone number test
  table: 'players',

  // create a new player number
  create: function(player, entry, platform) {
    let query = squel
                .insert()
                .into('players')
                .setFields({
                  created: squel.fval('NOW(3)')
                });

    if ( platform ) {
      query.setFields({'platform_id': squel
                    .select()
                    .field('id')
                    .from('platforms')
                    .where('platform=?', platform)});
    }

    if ( entry ) {
      query.setFields({'entry_id': squel
                                 .select()
                                 .field('id')
                                 .from('player_entries')
                                 .where('entry=?', entry)});
    }

    query.setFields({ 'state_id': squel
                                 .select()
                                 .field('id')
                                 .from('player_states')
                                 .where('state=?','waiting-for-confirmation')});

    return db.query(query.toString()).then(function(rows) {
      let player_id = rows.insertId;
      player.id = player_id;

      let insert_to_number = squel
                             .insert()
                             .into('player_attributes')
                             .setFields({
                               player_id: player_id,
                               attribute_id: squel
                                 .select()
                                 .field('id')
                                 .from('player_attribute_keys')
                                 .where('`key`=?','number'),
                               attribute: player.number
                             });

      let insert_from_number = squel
                               .insert()
                               .into('player_attributes')
                               .setFields({
                                 player_id: player_id,
                                 attribute_id: squel
                                   .select()
                                   .field('id')
                                   .from('player_attribute_keys')
                                   .where('`key`=?','to'),
                                 attribute: player.to
                               });
       return Promise.join(
         db.query(insert_from_number.toString()),
         db.query(insert_to_number.toString())
       ).then(function() {
         return player;
       });
    });
  },

  get: function(player) {
    if ( ! player.id && ! player.invited_player_id && ! player.number ) {
      throw new Error({
        message: 'Tried to select on an invalid player key'
      });
    } 

    let query = squel
                .select()
                .field('u.id')
                .field('u.created')
                .field('u.blacklist')
                .field('u.state_id')
                .field('i.inviter_player_id')
                .field('p.platform', 'platform')
                .field('s.state', 'state')
                .from('players', 'u')
                .where('u.archived=0')
                .left_join('invites', 'i', 'u.id = i.invited_player_id')
                .left_join('platforms', 'p', 'p.id = u.platform_id')
                .left_join('player_states', 's', 's.id = u.state_id');

    if ( player.id ) {
      query = query.where('u.`id`=?', player.id);
    } else if ( player.invited_player_id ) {
      query = query.where('i.invited_player_id=?', player.invited_player_id);
    } else {
      let number_attribute = squel
                             .select()
                             .field('attribute')
                             .field('player_id')
                             .from('player_attributes')
                             .where('attribute_id=?', squel
                                   .select()
                                   .field('id')
                                   .from('player_attribute_keys')
                                   .where('`key`=?','number')
                                   );
      query = query
              .left_join(number_attribute, 'number', 'number.player_id = u.id')
              .where('number.attribute=?', player.number);

      if ( player.to ) {

        let to_attribute = squel
                           .select()
                           .field('attribute')
                           .field('player_id')
                           .from('player_attributes')
                           .where('attribute_id=?', squel
                                 .select()
                                 .field('id')
                                 .from('player_attribute_keys')
                                 .where('`key`=?','to')
                                 );
        query = query
                .left_join(to_attribute, 'to', 'to.player_id = u.id')
                .where('to.attribute=?', player.to);
      }

    }

    return db.query(query.toString()).then(function(players) {
      if ( ! players.length ) {
        return null;
      } else {

        let player = players[0];

        let promises = [
          function() {
            let query = squel
                        .select()
                        .field('a.attribute')
                        .field('k.`key`')
                        .from('player_attributes', 'a')
                        .left_join('players', 'u', 'u.id = a.player_id')
                        .left_join('player_attribute_keys', 'k', 'k.id = a.attribute_id')
                        .where('a.player_id=?',player.id);

            return db.query(query);
          }(),
        ];

        if ( player.inviter_player_id ) {
          promises.push(Player.get({ id: player.inviter_player_id }));
        }

        return Promise.all(promises).then(function(results) {
          results[0].map(function(attribute) {
            player[attribute.key] = attribute.attribute;
          });
          if ( results[1] ) {
            player.inviter = results[1];
          }
          //player.game = game;
          return player;
        });

      }
    });
  },

  update: function(player, params) {
    // a whitelisted array of arguments we're allowed to update

    let queries = [];

    Object.keys(params).map(function(key) {
      let query;
      switch(key) {
        case 'state' :
          let state = squel
                       .select()
                       .field('id')
                       .from('player_states')
                       .where('state=?',params[key]);

          query = squel
                  .update()
                  .table('players', 'u')
                  .where('u.archived=0')
                  .where('u.id=?', player.id);
          query.set('state_id', state, { dontQuote: true });
          queries.push(query);
          break;
        case 'blacklist':
          query = squel
                  .update()
                  .table('players', 'u')
                  .where('u.archived=0')
                  .where('u.id=?', player.id);

          query.set(key, params[key]);
          queries.push(query);
          break;
        default:
          let attribute_id = squel
                             .select()
                             .field('id')
                             .from('player_attribute_keys')
                             .where('`key`=?',key);
          query = squel
                   .insert()
                   .into('player_attributes')
                   .setFields({
                     player_id: player.id,
                     attribute_id: attribute_id,
                     attribute: params[key]
                   })
                   .onDupUpdate('attribute', params[key]);

         queries.push(query);
         break;
      }
      player[key] = params[key];
    });

    return Promise.all(queries.map(function(query) {
      return db.query(query.toString()).then(function() {
        return player;
      });
    }));

  },
  logLastActivity: function(player, game_number) {
    if ( ! Game ) {
      Game = require('./game');
    }
    const promises = [];
    if ( player && player.id ) {
      let update_player = squel
                        .update()
                        .table('players')
                        .setFields({
                          last_activity: squel.fval('NOW(3)')
                        })
                       .where('id=?',player.id);

      promises.push(db.query(update_player));

      promises.push(Game.get({ player: player, game_number: game_number }).then(function(game) {
        if ( game && game.id ) {

          let update_game = squel
                            .update()
                            .table('games')
                            .setFields({
                              last_activity: squel.fval('NOW(3)')
                            })
                           .where('id=?',game.id);

          return db.query(update_game);
        }
      }));
    }

    return Promise.all(promises);
  }
};

module.exports = Player;
