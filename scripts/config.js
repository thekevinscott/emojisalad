var script = {
  'do-not-contact': [
    // what happens here?
    {
      regex: {
        pattern: '.*',
      },
      actions: [
      ]
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
          message: 'intro_2'
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
      regex: {
        pattern: '.*',
      },
      actions: [
        {
          type: 'respond',
          message: 'intro_3',
          options: function(user, body) {
            return [ body ];
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
          data: function(user, body) {
            return {
              state: 'waiting-for-invites',
              username: body
            };
          }
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
          type: 'respond',
          message: 'wait-to-invite'
        },
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
