var script = {
  'do-not-contact': [
    // what happens here?
    {
      regex: {
        pattern: '.*',
      },
      actions: [ ]
    }
  ],
  // waiting-for-confirmation
  'waiting-for-confirmation': [
    {
      regex: {
        pattern: '^yes$|^yeah|^yea|^y',
        flags: 'i',
      },
      actions: [
        {
          type: 'respond',
          message: function(user, body) {
            console.log('user', user);
            return 'intro_2';
          }
        },
        {
          type: 'request',
          url: function(user, body) {
            // TODO: When ES6, make this the below
            //return '/users/${user.id}';
            return '/users/'+user.id;
          },
          method: 'PUT',
          data: {
            state: 'waiting-for-nickname'
          }
        }
      ]
    },
    {
      regex: {
        pattern: '.*',
      },
      actions: [
        {
          type: 'request',
          url: function(user, body) {
            // TODO: When ES6, make this the below
            //return '/users/${user.id}';
            return '/users/'+user.id;
          },
          method: 'PUT',
          data: {
            state: 'do-not-contact'
          }
        }
      ]
    }
  ],
  'waiting-for-nickname': [
    {
      regex: {
        pattern: '^invite',
      },
      actions: [
        {
          type: 'respond',
          message: 'wait-to-invite'
        },
      ]
    },
    {
      // the user has passed their nickname
      // we now need to decide how to route them;
      // prompt them to invite users, or allow the
      // game to start?
      regex: {
        pattern: '.*',
      },
      actions: [
        {
          type: 'request',
          url: function(user, body) {
            return '/users/'+user.id;
          },
          method: 'PUT',
          data: function(user, body) {
            return {
              username: body,
              state: 'ready-for-game'
            };
          }
        },
        {
          type: 'request',
          url: function(user, body) {
            // TODO: When ES6, make this the below
            //return '/users/${user.id}';
            return '/users/'+user.id+'/games';
          },
          method: 'GET',
          callback: {
            fn: function(game) {
              console.log('what is the game', game);
              if ( game && game.state ) {
                return game.state;
              } else {
                return 'waiting-for-players';
              }
            },
            branches: [
              {
                regex: {
                  pattern: '^waiting-for-players'
                },
                actions: [
                  {
                    type: 'respond',
                    message: 'intro_3',
                    options: function(user, body, origBody) {
                      console.log('orig body', origBody);
                      return [ origBody ];
                    }
                  },
                  {
                    type: 'request',
                    url: function(user, body, origBody) {
                      // TODO: When ES6, make this the below
                      //return '/users/${user.id}';
                      return '/users/'+user.id;
                    },
                    method: 'PUT',
                    data: function(user, body, origBody) {
                      return {
                        state: 'waiting-for-invites',
                        username: origBody 
                      };
                    }
                  }
                ]
              },
              {
                regex: {
                  pattern: '.*'
                },
                actions: [
                  {
                    type: 'respond',
                    message: 'game-on',
                  },
                  // ACTUALLY, THE GAME SHOULD TAKE CARE OF UPDATING USER STATUSES
                  {
                    type: 'request',
                    url: function(user, body) {
                      // TODO: When ES6, make this the below
                      //return '/users/${user.id}';
                      return '/users/'+user.id;
                    },
                    method: 'PUT',
                    data: function(user, body) {
                      return {
                        state: 'game-lobby',
                        username: body
                      };
                    }
                  }
                ]
              },
            ]
          },
        },
      ]
    },
  ],
  'waiting-for-invites': [
    {
      regex: {
        pattern: '^invite',
      },
      actions: [
        {
          type: 'request',
          url: '/invites/new',
          method: 'POST',
          data: function(user, body) {
            return {
              user: user,
              type: 'twilio',
              value: body
            };
          }
        }
      ]
    },
    {
      regex: {
        pattern: '.*',
      },
      actions: [
        {
          type: 'respond',
          message: 'wtf'
        },
      ]
    },
  ]
};

module.exports = script;
