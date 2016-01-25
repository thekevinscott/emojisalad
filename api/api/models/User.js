/**
* User.js
*
* @description :: Definition of the User model which owns multiple players (associated with particular games)
*/

module.exports = {

  attributes: {
    archived: {
      type: Sequelize.BOOLEAN,
      defaultsTo: false
    },

    from: Sequelize.STRING,
    nickname: Sequelize.STRING,
    avatar: Sequelize.STRING,

    blacklist: {
      type: Sequelize.BOOLEAN,
      defaultsTo: false
    },

    maximum_games: {
      type: Sequelize.INTEGER,
      defaultsTo: 2
    }

  },

  associations: function () {
    User.hasMany(Player);
  },
  options: {
    freezeTableName: false,
    classMethods: {},
    instanceMethods: {},
    hooks: {
      beforeCreate: function(user, options) {
        return Emoji.findOne().then(function(result) {
          if ( result && result.emoji ) {
            user.avatar = result.emoji;
          } else {
            throw result;
          }
        });
      }
    },
    tableName: 'users',
    underscored: true,
    //constraints: false
  },
};
