/**
* Invite.js
*
*/

'use strict';
const Promise = require('bluebird');
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
    classMethods: {
      get: function(options) {
        let params = {};
        ['inviter_id', 'invited_id', 'used', 'id'].map((key) => {
          if ( options[key] ) {
            params[key] = options[key];
          }
        });
        const player_includes = [
          { model: State, as: 'state' },
          { model: GameNumber, as: 'game_number' },
          { model: User, as: 'user' },
        ];
        const includes = [
          { model: Player, as: 'inviter'},
          { model: Player, as: 'invited'}
        ];
        return Invite.findOne({ where: params, include: includes }).then((invite) => {
          if ( invite && invite.id ) {
            return Promise.join(
              Player.get({ id: invite.inviter_id }), 
              Player.get({ id: invite.invited_id }), 
              (inviter, invited) => {
                invite.inviter = inviter;
                invite.invited = invited;
                return invite;
              });

          }
        });
      },
      createInvite: function(invite, options) {
        const player_includes = [
          { model: State, as: 'state' },
          { model: GameNumber, as: 'game_number' },
          { model: User, as: 'user' },
        ];
        const inviter_id = invite.inviter_id;
        const invited = invite.invited;
        return Player.findOne({ where: { id: inviter_id }, include: player_includes }).then((inviter_player) => {
          if ( !inviter_player ) {
            return { error: `Invalid inviter: ${inviter_id}`};
          } else {
            // does the invited exist yet?
            return User.findOne({ where: { from: invited }}).then((invited_player) => {
              if ( ! invited_player ) {
                return User.create({
                  from: invited
                });
              } else {
                return invited_player;
              }
            }).then((invited_user) => {
              return Player.createPlayer({
                from: invited,
                to: '+15559999999'
              });
            }).then((player) => {
              return Player.findOne({
                where: {
                  id: player.id
                }, include: player_includes
              });
            }).then((invited_player) => {
              return Invite.create({
                invited_id: invited_player.id,
                inviter_id: inviter_player.id,
                used: false
              }).then((invite) => {
                //console.log('invite', invite);
                return Invite.get({ id: invite.id });
              });
            });
          }
        });
      },

    },
    instanceMethods: {},
    tableName: 'invites',
    underscored: true,
    //constraints: false
  },
};

//sequelize.sync({ logging: console.log })

