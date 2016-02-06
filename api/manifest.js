/***
* A description of the various api endpoints available
*
*/

module.exports = (port) => {
  const base_url = 'http://localhost:' + port + '/';

  return  {
    players: {
      get: {
        endpoint: `${base_url}players`,
        method: 'GET',
        description: 'Get a list of players with an optional query string'
      }
    },
    users: {
      get: {
        endpoint: `${base_url}users`,
        method: 'GET',
        description: 'Get a list of users with an optional query string'
      },
      create: {
        endpoint: `${base_url}users`,
        method: 'POST',
        description: 'Create a user'
      },
      update: {
        endpoint: `${base_url}users/:user_id`,
        method: 'PUT',
        description: 'Update a user'
      }
    }
  }
}
