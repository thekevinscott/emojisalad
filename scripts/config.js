var doNotContact = [
  // what happens here?
  {
    regex: {
      pattern: '.*',
    },
    actions: [ ]
  }
];

var waitingForConfirmation = [
  {
    regex: {
      pattern: '^yes|^yeah|^yea|^y$',
      flags: 'i',
    },
    actions: [
      {
        type: 'respond',
        message: 'intro_2',
      },
      {
        type: 'request',
        url: '/users/%(args[0].user.id)s',
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
        url: '/users/%(args[0].user.id)s',
        method: 'PUT',
        data: {
          state: 'do-not-contact'
        }
      }
    ]
  }
];

var waitingForNickname = [
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
        url: '/users/%(args[0].user.id)s',
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
        url: '/users/%(args[0].user.id)s/games',
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
          scenarios: [
            {
              regex: {
                pattern: '^waiting-for-players'
              },
              actions: [
                {
                  type: 'respond',
                  message: 'intro_3',
                  options: [
                    '%(args[0].pattern)s'
                  ]
                },
                {
                  type: 'request',
                  url: '/users/%(args[0].user.id)s',
                  method: 'PUT',
                  data: function(user, body) {
                    return {
                      state: 'waiting-for-invites',
                      username: body 
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
                  url: '/users/%(args[0].user.id)s',
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
];

var waitingForInvites = [
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
];

var script = {
  'do-not-contact': doNotContact,
  'waiting-for-confirmation': waitingForConfirmation ,
  'waiting-for-nickname': waitingForNickname,
  'waiting-for-invites': waitingForInvites,
};

module.exports = script;
