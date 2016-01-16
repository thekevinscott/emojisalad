/**
* Emoji.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    emoji: Sequelize.STRING
  },
  associations: function () {},
  options: {
    freezeTableName: false,
    classMethods: {},
    instanceMethods: {},
    hooks: {},
    tableName: 'emojis'
  },
};

