/**
* Player.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
'use strict';

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
        key: 'id'
      },
      allowNull: false
    },

    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },

    //to: {
      //type: Sequelize.INTEGER,
      //references: {
        //model: 'game_numbers',
        //key: 'id'
      //}
    //},
    
    //game_id: {
      //type: Sequelize.INTEGER,
      //references: {
        //model: 'games',
        //key: 'id'
      //}
    //},

  },
  associations: function () {
    Player.belongsTo(State);
    //Player.belongsTo(Game);
    Player.belongsTo(User);
    //Player.belongsTo(GameNumber, {
      //foreignKey: {
        //name: 'to',
        //allowNull: false
      //}
    //});
  },
  options: {
    freezeTableName: false,
    classMethods: {
    },
    instanceMethods: {},
    hooks: {
    },
    tableName: 'players'
  },

};

