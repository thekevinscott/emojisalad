'use strict';
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const registry = require('microservice-registry');
Promise.promisifyAll(request);
const squel = require('squel').useFlavour('mysql');
const db = require('db');
const api = db.api;

const handleError = (res, msg) => {
  res.status(500);
  res.json({
    error: msg || 'There was an unknown error',
  });
};

const getGames = (userId) => {
  const service = registry.get('api');

  const payload = {
    url: service.api.games.get.endpoint,
    method: service.api.games.get.method,
    qs: {
      user_id: userId,
    },
  };

  return request(payload).then(response => {
    if (! response || ! response.body) {
      throw response;
    }
    return response.body;
  }).then(response => {
    return JSON.parse(response);
  });
};

function route(req, res) {
  const userId = req.query.user_id;

  if (!userId) {
    return handleError(res, 'Please pass a user id');
  }

  return getGames(userId).then(games => {
    res.json(games);
  }).catch(err => {
    console.error('err', err);
    handleError(res);
  });
}

module.exports = function claim(req, res) {
  try {
    return route(req, res);
  } catch (err) {
    console.error('Caught error', err);
    handleError(res);
  }
};
