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
        url: '/users/$(user.id)s',
        method: 'PUT',
        data: function(user, body) {
          return {
            username: body,
            state: 'ready-for-game'
          };
        }
      },
      {
        type: 'respond',
        message: 'foo',
      },
      {
        type: 'request',
        url: '/users/$(user.id)s/games',
        method: 'GET',
        callback: {
          // this is a function for processing the return from the server
          // its a preprocessor that translates the server response into a format that can be regex'd against
          fn: function(game) {
            return 'waiting-for-players';
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
                  options: ['$(inputs[0])s']
                },
                {
                  type: 'respond',
                  message: 'intro_4',
                  options: [ '$(inputs[0])s']
                },
                {
                  type: 'request',
                  url: '/users/$(user.id)s',
                  method: 'PUT',
                  data: function(user, body, origBody) {
                    return {
                      state: 'waiting-for-invites',
                      username: origBody 
                    };
                  },

                  callback: {
                    fn: function() {
                      return 'foo';
                    },
                    scenarios: [
                      {
                        regex: {
                          pattern: '.*'
                        },
                        actions: [
                          {
                            type: 'respond',
                            message: 'deepest message',
                          },
                          {
                            type: 'respond',
                            message: 'deepest message %1$s %2$s',
                            options: [
                              '%(inputs[0])s',
                              '%(inputs[1])s'
                            ]
                          },
                        ]
                      },
                    ]
                  },
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
                  url: '/users/$(user.id)s',
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

var twoActions = [
  {
    regex: {
      pattern: '.*',
    },
    actions: [
      {
        type: 'respond',
        message: 'wait-to-invite'
      },
      {
        type: 'request',
        url: '/foo'
      },
    ]
  }
];

var parsingStrings = [
  {
    regex: {
      pattern: '^invite(.*)',
      match: {
        pattern: '^invite\\s*(.*)'
      }
    },
    actions: [
      {
        type: 'respond',
        message: 'invited user: %1$s',
        options: [
          '%(inputs[0])s'
        ]
      },
    ]
  }
]
var config = {
  'foo': 'bar',
  'waiting-for-nickname': waitingForNickname,
  'two-actions': twoActions,
  'parsing-strings': parsingStrings
};
module.exports = config;
