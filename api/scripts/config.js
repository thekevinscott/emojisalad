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
        url: '/users/%(user.id)s',
        method: 'PUT',
        data: {
          state: 'waiting-for-nickname'
        }
      },
    ]
  },
  {
    regex: {
      pattern: '.*',
    },
    actions: [
      {
        type: 'request',
        url: '/users/%(user.id)s',
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
    // prompt them to invite users, or start the
    // game?
    regex: {
      pattern: '.*',
    },
    actions: [
      {
        type: 'request',
        url: '/users/%(user.id)s',
        method: 'PUT',
        data: function(user, body) {
          return {
            username: body,
            state: 'ready-for-game'
          };
        },
        callback: {
          // this will determine what message to send back,
          // based on whether a game is happening or not
          fn: function(resp) {
            return resp[0].game_state;
          },
          scenarios: [
            {
              regex: {
                pattern: 'pending'
              },
              actions: [
                {
                  type: 'respond',
                  message: 'intro_3',
                  options: [
                    '%(inputs[0])s'
                  ]
                },
                {
                  type: 'request',
                  url: '/users/%(user.id)s',
                  method: 'PUT',
                  data: function(user, body) {
                    return {
                      state: 'waiting-for-invites',
                      username: body 
                    };
                  }
                },
              ]
            },
            {
              regex: {
                pattern: 'ready-to-play'
              },
              actions: [
                {
                  type: 'request',
                  url: '/users/%(user.id)s',
                  method: 'PUT',
                  data: function(user, body) {
                    return {
                      state: 'playing',
                      username: body 
                    };
                  }
                },
                {
                  type: 'request',
                  url: '/users/%(user.id)s/inviter',
                  method: 'GET',
                  callback: {
                    fn: function(inviter) {
                      console.log('the inviter!!!zomg', inviter[0]);
                      return inviter[0];
                    },
                    scenarios: [
                      {
                        regex: {
                          pattern: '.*'
                        },
                        actions: [
                          {
                            type: 'respond',
                            message: 'accepted-inviter',
                            options: [
                              '%(inputs[0])s',
                              '%(inputs[2].username)s',
                            ]
                          },
                          {
                            type: 'sms',
                            message: 'accepted-invited',
                            to: '%(inputs[2].number)s',
                            options: [
                              '%(inputs[0])s',
                            ]
                          },
                          //{
                            //type: 'request',
                            //url: '/games/phrase',
                            //method: 'POST',
                            //data: function(user, input) {
                              //return {
                                //user_id: user.id
                              //};
                            //},
                            //callback: {
                              //fn: function(response) {
                                //return response[0];
                              //},
                              //scenarios: [
                                //{
                                //regex: {
                                  //pattern: '.*'
                                //},
                                //actions: [
                                  //{
                                    //type: 'sms',
                                    //message: 'game-start',
                                    //to: '%(inputs[2].number)s',
                                    //options: [
                                      //'%(inputs[2].username)s',
                                      //'%(inputs[3].phrase)s',
                                    //]
                                  //},
                                //]
                              //},
                              //]
                            //}
                          //}
                        ]
                      }
                    ]
                  }
                }
              ]
            }
          ]
          //scenarios: [
            //{
              //regex: {
                //pattern: '^waiting-for-players'
              //},
              //actions: [
                //{
                  //type: 'respond',
                  //message: 'intro_3',
                  //options: [
                    //'%(inputs[0])s'
                  //]
                //},
              //]
            //},
            //{
              //regex: {
                //pattern: '^pending'
              //},
              //actions: [
                //{
                  //type: 'request',
                  //url: '/users/%(user.id)s/inviter',
                  //method: 'GET',
                  //callback: {
                    //fn: function(inviter) {
                      //console.log('the inviter');
                      //return inviter[0];
                    //},
                    //scenarios: [
                      //{
                        //regex: {
                          //pattern: '.*'
                        //},
                        //actions: [
                          //{
                            //type: 'request',
                            //url: '/games/create',
                            //method: 'POST',
                            //data: function(user, body) {
                              //return {
                                //user_id: user.id
                              //}
                            //}
                          //},
                          //{
                            //type: 'request',
                            //url: '/users/%(user.id)s',
                            //method: 'PUT',
                            //data: {
                              //state: 'waiting-for-round'
                            //},
                          //},
                          //{
                            //type: 'request',
                            //url: '/users/%(inputs[2].id)s',
                            //method: 'PUT',
                            //data: {
                              //state: 'waiting-for-submission'
                            //}
                          //},
                        //]
                      //},
                    //]
                  //}
                //}
              //]
            //},
          //]
        },
      },
    ]
  },
];

var waitingForInvites = [
  {
    regex: {
      pattern: '^invite(.*)',
      match: {
        pattern: '^invite\\s*(.*)'
      }
    },
    actions: [
      {
        type: 'request',
        url: '/invites/new',
        method: 'POST',
        data: function(user, input) {
          console.log('*********go send that invite');
          return {
            user: user,
            type: 'twilio',
            value: input // the first match in our regex above
          };
        },
        callback: {
          fn: function(resp) {
            console.log('response from inviting', resp[0]);
            if ( resp[0].error ) {
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
                    '%(inputs[0])s'
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
                    '%(inputs[0])s'
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
                pattern: '^9$'
              },
              actions: [
                {
                  type: 'respond',
                  message: 'error-9',
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
                    '%(inputs[1])s'
                  ]
                },
                {
                  type: 'sms',
                  message: 'invite',
                  to: '%(inputs[1])s',
                  options: [
                    '%(user.number)s',
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
        message: 'error-8'
      },
    ]
  },
];

var waitingForRound = [
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

var waitingForSubmission = [
  {
    regex: {
      pattern: '.*',
    },
    actions: [
      {
        type: 'request',
        url: '/games/submission',
        method: 'POST',
        data: function(user, input) {
          return {
            user_id: user.id,
            message: input
          };
        },
        callback: {
          fn: function(resp) {
            console.log('resp', resp[0]);
            if ( resp[0].error ) {
              //console.log('error', resp[0]);
              return resp[0].error.errno;
            } else {
              // it returns a game
              return resp[0];
            }
          },
          scenarios: [
            // this implies an error
            {
              regex: {
                pattern: '^9$'
              },
              actions: [
                {
                  type: 'respond',
                  message: 'error-9',
                },
              ]
            },
            // this is the correct response
            {
              regex: {
                pattern: '.*'
              },
              actions: [
                // the submitter has done his/her job and sent the clue
                // they wait the rest of the round
                {
                  type: 'respond',
                  message: 'game-submission-sent',
                },
                // update our guesser (first one's) state
                {
                  type: 'sms',
                  message: 'says',
                  to: '%(inputs[1].guessers[0].number)s',
                  options: [
                    '%(inputs[1].submitter.username)s',
                    '%(inputs[0])s'
                  ]
                },
                {
                  type: 'sms',
                  message: 'guessing-instructions',
                  to: '%(inputs[1].guessers[0].number)s',
                },
              ]
            },
          ]
        },
      }
    ]
  },
];

var guessing = [
  {
    regex: {
      pattern: '.*',
    },
    actions: [
      {
        type: 'request',
        url: '/games/guess',
        method: 'POST',
        data: function(user, input) {
          return {
            user_id: user.id,
            message: input
          };
        },
        callback: {
          fn: function(resp) {
            var result = (resp[0].result) ? 1 : 0;
            return result;
          },
          scenarios: [
            {
              regex: {
                pattern: '^0'
              },
              actions: [
                {
                  type: 'request',
                  url: '/games/players',
                  method: 'GET',
                  data: function(user) {
                    return {
                      user_id: user.id
                    }
                  },
                  callback: {
                    fn: function(resp) {
                      return resp[0].users;
                    },
                    scenarios: [
                      {
                        regex: {
                          pattern: '.*'
                        },
                        actions: [
                          {
                            type: 'sms',
                            message: 'says',
                            //to: 'foo',
                            to: '%(inputs[2][0].number)s',
                            options: [
                              '%(user.username)s',
                              '%(inputs[0])s'
                            ]
                          },
                        ]
                      }
                    ]
                  }
                },
              ]
            },
            {
              regex: {
                pattern: '^1'
              },
              actions: [
                {
                  type: 'respond',
                  message: 'correct-guess',
                  options: [
                    '%(user.username)s',
                  ]
                },
                {
                  type: 'request',
                  url: '/games/players',
                  method: 'GET',
                  data: function(user) {
                    return {
                      user_id: user.id
                    }
                  },
                  callback: {
                    fn: function(resp) {
                      return resp[0].users;
                    },
                    scenarios: [
                      {
                        regex: {
                          pattern: '.*'
                        },
                        actions: [
                          {
                            type: 'sms',
                            message: 'correct-guess',
                            //to: 'foo',
                            to: '%(inputs[2][0].number)s',
                            options: [
                              '%(user.username)s',
                            ]
                          },
                          {
                            type: 'sms',
                            message: 'game-next-round',
                            //to: 'foo',
                            to: '%(inputs[2][0].number)s',
                            options: [
                              '%(user.username)s',

                            ]
                          },
                          {
                            type: 'request',
                            url: '/games/phrase',
                            method: 'POST',
                            data: function(user, input) {
                              return {
                                user_id: user.id
                              };
                            },
                            callback: {
                              fn: function(response) {
                                console.log(response[0]);
                                return response[0];
                                //return inviter[0];
                              },
                              scenarios: [
                                {
                                  regex: {
                                    pattern: '.*'
                                  },
                                  actions: [
                                    {
                                      type: 'sms',
                                      message: 'game-next-round-suggestion',
                                      //to: 'foo',
                                      to: '%(user.number)s',
                                      options: [
                                        '%(user.username)s',
                                        '%(inputs[3].phrase)s',
                                      ]
                                    },
                                  ]
                                }
                              ]
                            }
                          }
                        ]
                      }
                    ]
                  }
                },
              ]
            },
          ]
        },
      }
    ]
  },
];

var waiting = [
  {
    regex: {
      pattern: '.*',
    },
    actions: [
      {
        type: 'request',
        url: '/games/players',
        method: 'GET',
        data: function(user) {
          return {
            user_id: user.id
          }
        },
        callback: {
          fn: function(resp) {
            console.log('somebody says something', resp);
            return resp[0].users;
          },
          scenarios: [
            {
              regex: {
                pattern: '.*'
              },
              actions: [
                {
                  type: 'sms',
                  message: 'says',
                  //to: 'foo',
                  to: '%(inputs[1][0].number)s',
                  options: [
                    '%(user.username)s',
                    '%(inputs[0])s'
                  ]
                },
              ]
            }
          ]
        }
      },
    ]
  },
];

var newUser = [
  {
    regex: {
      pattern: '.*',
    },
    actions: [
      {
        type: 'request',
        url: '/users/create',
        method: 'POST',
        data: function(user, body) {
          return {
            number: user.number,
            entry: 'text',
            platform: 'twilio'
          };
        },
        callback: {
          fn: function(resp) {
            if ( resp[0].error ) {
              console.error('WTF', resp);
              return resp[0].errno;
            } else {
              return '';
            }
          },
          scenarios: [
            {
              regex: {
                pattern: '.*'
              },
              actions: [
                {
                  type: 'respond',
                  message: 'intro'
                }
              ]
            }
          ]
        }
      }
    ]
  }
]

var script = {
  'do-not-contact': doNotContact,
  'waiting-for-confirmation': waitingForConfirmation ,
  'waiting-for-nickname': waitingForNickname,
  'waiting-for-invites': waitingForInvites,
  'waiting-for-submission': waitingForSubmission,
  'waiting-for-round': waitingForRound,
  'guessing': guessing,
  'waiting': waiting,
  'new-user': newUser
};

module.exports = script;
