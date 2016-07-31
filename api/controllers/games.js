'use strict';
const Game = require('models/game');
const Promise = require('bluebird');
const _ = require('lodash');
const request = Promise.promisify(require('request'));

const invites = require('./invites');
const rounds = require('./rounds');
const registry = require('microservice-registry');
let sms;
function create(req) {
  const users = req.body.users;
  if ( ! users || !_.isArray(users) ) {
    throw new Error("You must provide an array of users");
  }
  return Game.create(users);
}
function find(req) {
  return Game.find(req.query);
}
function findOne(req) {
  const game_id = req.params.game_id;
  if ( ! game_id ) {
    throw new Error("No game ID provided, how is that possible?");
  } else if ( !parseInt(game_id) ) {
    throw new Error("Invalid game ID provided");
  }
  return Game.findOne(game_id);
}
function add(req) {
  //console.debug('game add!!');
  const game_id = req.params.game_id;
  if ( ! game_id ) {
    throw new Error("No game ID provided, how is that possible?");
  } else if ( !parseInt(game_id) ) {
    throw new Error("Invalid game ID provided");
  }
  const users = req.body.users;
  if ( ! users || !_.isArray(users) ) {
    throw new Error("You must provide an array of users");
  }
  return Game.add(game_id, users);
}

function getReceivedAndSent(player) {
  function getMessagesByType(type) {
    let qs;
    if ( type === 'sent' ) {
      qs = {
        from: player.to,
        to: player.from
      };
    } else {
      qs = {
        from: player.from,
        to: player.to
      };
    }
    const payload = {
      url: sms.api[type].endpoint,
      method: sms.api[type].method,
      qs
    };

    return request(payload).then((response) => {
      if ( ! response || ! response.body ) {
        throw response;
      }
      let body = response.body;

      // if err, already parsed
      try { body = JSON.parse(body); } catch (err) {
        // swallow it
      }

      body = body.map((b) => {
        return _.assign({
          type
        }, b);
      });
      return body;
    }).catch((err) => {
      console.error(err);
      throw err;
    });
  }
  return Promise.join(
    getMessagesByType('received'),
    getMessagesByType('sent'),
    (received, sent) => {
      return received.concat(sent).sort((a, b) => {
        //console.log(a.timestamp, b.timestamp);
        return a.timestamp - b.timestamp;

      }).map((message) => {
        return _.assign({
          date: new Date(message.timestamp * 1000)
        }, message);
      });
    }
  );
}

function messages(req) {
  const game_id = req.params.game_id;
  if ( ! game_id ) {
    throw new Error("No game ID provided, how is that possible?");
  } else if ( !parseInt(game_id) ) {
    throw new Error("Invalid game ID provided");
  }
  return new Promise((resolve) => {
    if ( ! sms ) {
      sms = registry.get('sms');
    }
    if ( sms ) {
      Game.findOne({ id: game_id }).then((game) => {
        return Promise.reduce(game.players, (obj, player) => {
          return getReceivedAndSent(player).then((foundMessages) => {
            obj[player.nickname] = foundMessages;
            return obj;
          });
        }, {}).then((obj) => {
          resolve(obj);
        });
      });
    } else {
      console.error('no sms');
      resolve([]);
    }
  });
}

module.exports = [
  {
    path: '/',
    method: 'get',
    fn: find
  },
  {
    path: '/',
    method: 'post',
    fn: create
  },
  {
    path: '/:game_id',
    method: 'get',
    fn: findOne
  },
  {
    path: '/:game_id/players',
    method: 'post',
    fn: add
  },
  {
    path: '/:game_id/messages',
    method: 'get',
    fn: messages
  }
].concat([
  invites.create,
  invites.use,
  invites.find,
  rounds.find,
  rounds.create,
  rounds.update,
  rounds.guess
]);

