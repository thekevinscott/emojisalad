/**
* Player.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
'use strict';

const Promise = require('bluebird');

module.exports = {

  attributes: {
    archived: {
      type: Sequelize.BOOLEAN,
      defaultsTo: false
    },

    state_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'states',
        key: 'id',
      },
      //allowNull: false
    },

    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },

    game_number_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'game_numbers',
        key: 'id'
      }
    },
    
    //game_id: {
      //type: Sequelize.INTEGER,
      //references: {
        //model: 'games',
        //key: 'id'
      //}
    //},

  },
  associations: function () {
    //Player.hasMany(Invite, {
      //foreignKey: {
        //name: 'inviter_player_id',
        //allowNull: false
      //}
    //});
    Player.hasMany(Invite);
    Player.belongsTo(State, { as: 'state' });
    Player.belongsTo(User, { as: 'user' });
    Player.belongsTo(GameNumber, {
      foreignKey: {
        name: 'game_number_id',
        allowNull: false
      },
      as: 'game_number'
    });
  },
  options: {
    freezeTableName: false,
    classMethods: {
      get: (params, options) => {
        return new Promise((resolve) => {
          resolve();
        }).then(() => {
          if ( params.id ) {
            return {
              id: params.id
            };
          } else {
            const to = params.to;
            const from = params.from;
            function getUser(from) {
              return User.findOne({ where: { from: from } });
            }

            function getGameNumber(to) {
              return GameNumber.findOne({ where: { number: to } });
            }
            return Promise.join(getUser(from), getGameNumber(to), function(user, game_number) {
              if ( ! user ) {
                console.log('aint no user');
                return { error: `No user found` };
              }
              if ( ! game_number ) {
                return { error: `No game number found` };
              }

              return {
                user_id: user.id,
                game_number_id: game_number.id,
                archived: null
              };
            });
          }
        }).then((where_params) => {
          if ( ! where_params.error) {
            const includes = [
              { model: GameNumber, as: 'game_number' },
              { model: User, as: 'user' },
              { model: State, as: 'state' }
            ];

            return Player.findOne({ where: where_params, include: includes }).then(function(player) {
              //console.log('player', player.dataValues);
              return {
                id: player.id,
                state: player.state.state,
                archived: player.archived,
                user_id: player.user.id,
                to: player.game_number.number,
                from: player.user.from,
                avatar: player.user.avatar,
                nickname: player.user.nickname,
              };
            });
          } else {
            return where_params;
          }
        });
      },
      createPlayer: (params, options) => {
        const default_state = 'waiting-for-confirmation';
        const state = params.state || default_state;
        const from = params.from;
        const to = params.to;
        const promises = [{
          model: State,
          where_clause: { state: state }
        }, {
          model: GameNumber,
          where_clause: { number: to }
        }, {
          model: User,
          where_clause: { from: from }
        }].map(function(association) {
          return association.model.findOne({ where: association.where_clause}).then(function(result) {
            if ( result ) {
              return result;
            }
          });
        });

        return Promise.all(promises).then(function(results) {
          let state_result = results[0];
          let game_number = results[1];
          let user = results[2];

          if ( ! state_result ) {
            return { error:  `Invalid state provided: ${state}` };
          } else if ( ! game_number ) {
            return { error: `Invalid to number provided: ${to}` };
          } else if ( ! user ) {
            return { error: `Invalid from number provided: ${from}` };
          }

          const params = {
            game_number_id: game_number.id,
            state_id: state_result.id,
            user_id: user.id
          };
          return Player.create(params).then((player) => {
            return {
              to: to,
              state: state_result.state,
              id: player.id,
              from: user.from,
              avatar: user.avatar,
              user_id: user.id
            };
          });
        });
      }
    },
    instanceMethods: {},
    hooks: {
    },
    tableName: 'players',
    underscored: true,
    //constraints: false
  },

};

