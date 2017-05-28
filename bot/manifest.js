/***
* A description of the various api endpoints available
*
*/

const getManifest = (port) => {
  const endpoint = 'http://localhost:' + port + '/';

  const manifest = {
    base_url: endpoint,

    ping: {
      endpoint: endpoint + 'ping',
      method: 'GET',
      description: 'An endpoint for calling back the Bot'
    },
    newGame: {
      endpoint: endpoint + 'newGame',
      method: 'POST',
      description: 'An endpoint for notifying the bot a game has been created manually'
    }
  };

  return manifest;
};

module.exports = getManifest;
