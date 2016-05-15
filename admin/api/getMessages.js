'use strict';
const fetch = require('../fetch');
const Promise = require('bluebird');

module.exports = (req, res) => {
  // first, get all associated players
  getPlayers(req.params.game_id)
  .then(game => game.players)
    // concatenate players by protocol
  .then(players => players.reduce((obj, player) => {
    if (!obj[player.protocol]) { obj[player.protocol] = []; }
    obj[player.protocol].push(player);
    return obj;
  }, {})).then(players_by_protocol => {
    return Object.keys(players_by_protocol).reduce((messages_by_protocol, protocol) => {
      const pairs = players_by_protocol[protocol].map(player => {
        return {
          to: player.to,
          from: player.from
        };
      });

      // for a given protocol (in a given game),
      // these are all the messages we have
      return Promise.join(
        getMessages('received', protocol, pairs),
        getMessages('sent', protocol, pairs),
        (received, sent) => {
          return setType(received, 'received').concat(setType(sent, 'sent'));
        }
      ).then(messages => {
        return Object.assign({}, messages_by_protocol, {
          protocol: messages.reduce((messages_by_player, message) => {
            let player_sender;
            if (message.type === 'received') {
              player_sender = message.from;
            } else {
              player_sender = message.to;
            }
            if (!messages_by_player[player_sender]) { messages_by_player[player_sender] = []; }
            messages_by_player[player_sender].push(message);
            return messages_by_player;
          }, {})
        });
      });
    }, {});
  }).then(messages_by_protocol => {
    return Object.keys(messages_by_protocol).reduce((players, protocol) => Object.assign({}, players, messages_by_protocol[protocol]), {});
  }).then(messages_by_player => {
    res.json(messages_by_player);
  }).catch(err => {
    console.error(err);
  });
};

function getPlayers(game_id) {
  return fetch(`games/${game_id}`, 'get');
};

function getEndpoint(manifest) {
  return manifest.sent.endpoint.substring(0, 22);
};

function getMessages(route, protocol, pairs) {
  const players = pairs.map(pair => {
    return `${pair.to}:${pair.from}`;
  });
  const url = `${route}?order=DESC&players=${encodeURIComponent(players.join(','))}`;
  return fetch(url, 'get', null, protocol, getEndpoint);
}
function setType(messages, type) {
  return messages.map(message => {
    return Object.assign({}, message, {
      type
    });
  });
}
