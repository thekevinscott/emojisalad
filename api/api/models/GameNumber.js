/**
* GameNumber.js
*
*/

module.exports = {
  attributes: {
    number: Sequelize.STRING
  },

  associations: function () {
    GameNumber.hasMany(Player);
  },

  options: {
    freezeTableName: false,
    classMethods: { },
    instanceMethods: {},
    hooks: {},
    tableName: 'game_numbers',
    underscored: true
  }

};

