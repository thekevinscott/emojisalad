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

  return api.query(updateQuery).then(() => {
    // update was successful
    return Object.assign({}, user, {
      protocol: 'appqueue',
    });
  });
};

function saveUser(user, device) {
  const stringifiedDevice = JSON.stringify(device);

  const insertQuery = squel
  .insert()
  .into('users')
  .setFields({
    number: user.from,
    user_id: user.id,
    device: stringifiedDevice,
    created: squel.fval('NOW(3)'),
  })
  .onDupUpdate('device', stringifiedDevice);

  return db.query(insertQuery.toString());
}

function route(req, res) {
  console.info('begin to claim');
  const text = req.body.text;
  const device = req.body.device;
  console.info(text, device);

  return parsePhone(text).then(phone => {
    console.info('phone parsed', phone);
    if (!phone) {
      return handleError(res, 'Invalid phone number');
    }

    const query = squel
    .select()
    .from('users')
    .where('`from`=?', phone);

    console.info(query.toString());
    return api.query(query).then(response => {
      console.info('users back', response);
      if (response.length === 0) {
        return handleError(res, `No users found for ${text}`);
      }

      return updateUser(response.shift()).then(user => {
        console.info('user upated');
        res.json(user);
        saveUser(user, device);
      });
    });
  }).catch(err => {
    console.error('err', err);
    handleError(res);
  });
}

module.exports = function claim(req, res) {
  console.info('this is the claim route');
  try {
    return route(req, res);
  } catch (err) {
    console.error('Caught error', err);
    handleError(res);
  }
};
