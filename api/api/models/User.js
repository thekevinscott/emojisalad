/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    archived: {
      type: 'BOOLEAN',
      defaultsTo: false
    },

    from: 'STRING',
    nickname: 'STRING',
    avatar: 'STRING',

    blacklist: {
      type: 'BOOLEAN',
      defaultsTo: false
    },

    games: {
      collection: 'game',
      via: 'users'
    }

  },
};

