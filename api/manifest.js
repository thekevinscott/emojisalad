/***
* A description of the various api endpoints available
*
*/

const getManifest = (port) => {
  const base_url = 'http://localhost:' + port + '/';

  const manifest = {
    base_url,
    email: {
      parse: {
        endpoint: `${base_url}email/:email`,
        method: 'GET'
      }
    },
    emoji: {
      get: {
        endpoint: `${base_url}emoji`,
        method: 'GET'
        //description: 'Get a random emoji'
      },
      checkInput: {
        endpoint: `${base_url}emoji/check`,
        method: 'POST'
        //description: 'Check whether a given emoji is valid emoji'
      }
    },
    games: {
      add: {
        endpoint: `${base_url}games/:game_id/players`,
        method: 'POST'
      },
      create: {
        endpoint: `${base_url}games`,
        method: 'POST'
        //description: 'Create a games'
      },
      get: {
        endpoint: `${base_url}games`,
        method: 'GET'
        //description: 'Get a list of games with an optional query string'
      }
    },
    invites: {
      create: {
        endpoint: `${base_url}games/:game_id/invite`,
        method: 'POST'
        //description: 'Create an invite with a game ID, an inviter ID, and some invites'
      },
      get: {
        endpoint: `${base_url}invites`,
        method: 'GET'
        //description: 'Get a list of invites with an optional query string'
      },
      getOne: {
        endpoint: `${base_url}invites/:invite_id`,
        method: 'GET'
        //description: 'Get a specific invite by ID'
      },
      use: {
        endpoint: `${base_url}games/:game_id/invites/:invite_id/use`,
        method: 'POST'
        //description: 'Use a specific invite by ID'
      }
    },
    players: {
      get: {
        endpoint: `${base_url}players`,
        method: 'GET'
        //description: 'Get a list of players with an optional query string'
      }
    },
    rounds: {
      create: {
        endpoint: `${base_url}games/:game_id/rounds`,
        method: 'POST'
        //description: 'Create a new round'
      },
      get: {
        endpoint: `${base_url}games/:game_id/rounds`,
        method: 'GET'
        //description: 'Get a list of rounds'
      },
      guess: {
        endpoint: `${base_url}rounds/:round_id/guess`,
        method: 'POST'
        //description: 'Get a list of rounds'
      },
      update: {
        endpoint: `${base_url}rounds/:round_id`,
        method: 'PUT'
      }
    },
    users: {
      get: {
        endpoint: `${base_url}users`,
        method: 'GET'
        //description: 'Get a list of users with an optional query string'
      },
      create: {
        endpoint: `${base_url}users`,
        method: 'POST'
        //description: 'Create a user'
      },
      update: {
        endpoint: `${base_url}users/:user_id`,
        method: 'PUT'
        //description: 'Update a user'
      }
    },
    phones: {
      parse: {
        endpoint: `${base_url}phones/:phone`,
        method: 'GET'
      }
    }
  };

  return manifest;
};

module.exports = getManifest;
