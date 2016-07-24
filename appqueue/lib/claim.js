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

const parsePhone = (number) => {
  const service = registry.get('sms');

  const payload = {
    url: service.api.phone.endpoint,
    method: service.api.phone.method,
    qs: {
      number,
    },
  };

  return request(payload).then(response => {
    if (! response || ! response.body) {
      throw response;
    }
    return response.body;
  }).then(response => {
    return JSON.parse(response).number;
  });
};

const updateUser = (user) => {
  const updateQuery = squel
  .update()
  .table('users')
  .setFields({
    protocol: 'appqueue',
  })
  .where('id=?', user.id);

  return api.query(updateQuery).then(response => {
    // update was successful
    return Object.assign({}, user, {
      protocol: 'appqueue',
    });
  });
};

function route(req, res) {
  const text = req.body.text;

  return parsePhone(text).then(phone => {
    if (!phone) {
      return handleError(res, 'Invalid phone number');
    }

    const query = squel
    .select()
    .from('users')
    .where('`from`=?', phone);

    return api.query(query).then(response => {
      if (response.length === 0) {
        return handleError(res, `No users found for ${text}`);
      }
      return updateUser(response.shift()).then(user => {
        res.json(user);
      });
    });
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
