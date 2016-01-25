/**
* Invite.js
*
*/

module.exports = {

  attributes: {
    used: {
      type: Sequelize.BOOLEAN,
      defaultsTo: false
    },

    /*
    inviter_player_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Player',
        key: 'id',
      },
    },

    /*
    invited_user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    */

  },

  associations: function () {
    Invite.belongsTo(Player, {
      foreignKey: 'invited_id',
      as: 'invited',
      constraints: false
    });
    Invite.belongsTo(Player, {
      foreignKey: 'inviter_id',
      as: 'inviter',
      constraints: false
    });
    //Invite.hasOne(User);
    //User.belongsTo(Invite);
    //Player.belongsTo(Invite);
  },
  options: {
    freezeTableName: false,
    classMethods: {},
    instanceMethods: {},
    tableName: 'invites',
    underscored: true,
    //constraints: false
  },
};

//sequelize.sync({ logging: console.log })

