const registry = require('microservice-registry');
const squel = require('squel').useFlavour('mysql');
const db = require('db');

const parsePhone = require('../utils/parsePhone');
const getUsers = require('../utils/getUsers');

const handleError = (message) => {
  console.log('error message', message);
  return new Error(JSON.stringify({
    type: 'CLAIM_REJECTED',
    message,
  }));
};

module.exports = function claim(payload) {
  console.info('claim it!');
  const text = payload.text;
  const device = payload.device;
  console.info(text, device);

  return parsePhone(text).then(phone => {
    console.info('phone parsed', phone);
    if (!phone) {
      throw handleError('Invalid phone number');
    }

    return getUsers(phone);
  }).then(users => {
    console.info('users back', users);

    if (users.length === 0) {
      throw handleError(`No users found for ${text}`);
    }
    return users.shift();
  }).then(user => {
    // kick off updateUser.
    return user;
  });
};
