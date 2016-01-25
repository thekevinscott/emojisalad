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
    Player.belongsTo(State);
    Player.belongsTo(User);
    Player.belongsTo(GameNumber, {
      foreignKey: {
        name: 'game_number_id',
        allowNull: false
      }
    });
  },
  options: {
    freezeTableName: false,
    classMethods: { },
    instanceMethods: {},
    hooks: {
      beforeCreate: function(player) { }
    },
    tableName: 'players',
    underscored: true,
    //constraints: false
  },

};

