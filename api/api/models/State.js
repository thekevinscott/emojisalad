/**
* State.js
*
* @description :: The state of a player.
* It'd really be great to remove this, and use logic to infer what the player's state is, but this is a holdover from the old system.
*/

module.exports = {

  attributes: {
    state: Sequelize.STRING
  },
  associations: function () {
    State.hasMany(Player);
  },
  options: {
    freezeTableName: false,
    classMethods: { },
    instanceMethods: {},
    hooks: { },
    tableName: 'states',
    underscored: true
  },
};

