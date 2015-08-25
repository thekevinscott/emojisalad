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
          fn: function(games) {
            console.log('what is the game', games);
            if ( games && games.length && games[0].state ) {
              return games[0];
              //return games[0].state;
            } else {
              console.log('no game or no game state');
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
                {
                  type: 'request',
                  url: '/users/%(args[0].user.id)s/inviter',
                  method: 'GET',
                  callback: {
                    fn: function(inviter) {
                      return inviter[0].number;
                    },
                    scenarios: [
                      {
                        regex: {
                          pattern: '.*'
                        },
                        actions: [
                          {
                            type: 'sms',
                            message: 'accepted',
                            to: '%(args[2].pattern)s',
                            options: [
                              '%(args[0].user.number)s',
                              //'%(args[0].pattern)s'
                            ]
                          },
                        ]
                      },
                    ]
                  }
                }
                //{
                  //type: 'request',
                  //url: '/users/%(args[0].user.id)s',
                  //method: 'PUT',
                  //data: function(user, body) {
                    //return {
                      //state: 'game-lobby',
                      //username: body
                    //};
                  //}
                //}
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
      pattern: '^invite(.*)',
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
        },
        callback: {
          fn: function(resp) {
            console.log('what is the response', resp);
            if ( resp[0].error ) {
              //console.log('error', resp[0].error);
              return resp[0].error.errno;
            } else {
              return resp[0].invited_user.number;
            }
            //return User.message(invitingUser, 'intro_4', [ invitedUser.number ]);
            //console.log('what is the game', game);
            //
            //if ( game && game.state ) {
              //return game.state;
            //} else {
              //return 'waiting-for-players';
            //}
          },
          scenarios: [
            // this implies an error
            {
              regex: {
                pattern: '^1$'
              },
              actions: [
                {
                  type: 'respond',
                  message: 'error-1',
                },
              ]
            },
            // this implies an error
            {
              regex: {
                pattern: '^2$'
              },
              actions: [
                {
                  type: 'respond',
                  message: 'error-2',
                  options: [
                    '%(args[0].pattern)s'
                  ]
                },
              ]
            },
            // this implies an error
            {
              regex: {
                pattern: '^3$'
              },
              actions: [
                {
                  type: 'respond',
                  message: 'error-3',
                  options: [
                    '%(args[0].pattern)s'
                  ]
                },
              ]
            },
            // this implies an error
            {
              regex: {
                pattern: '^6$'
              },
              actions: [
                {
                  type: 'respond',
                  message: 'error-6',
                },
              ]
            },
            // this implies an error
            {
              regex: {
                pattern: '^8$'
              },
              actions: [
                {
                  type: 'respond',
                  message: 'error-8',
                },
              ]
            },
            {
              regex: {
                pattern: '.*'
              },
              actions: [
                {
                  type: 'respond',
                  message: 'intro_4',
                  options: [
                    '%(args[1].pattern)s'
                  ]
                },
                {
                  type: 'sms',
                  message: 'invite',
                  to: '%(args[1].pattern)s',
                  options: [
                    '%(args[0].user.number)s',
                    //'%(args[0].pattern)s'
                  ]
                }
              ]
            },
          ]
        },
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
