import registry from 'microservice-registry';

import parsePhone from '../phones/parsePhone';
import getUsers from '../users/getUsers';
import handleError from '../lib/handleError';

const REJECTED = 'CLAIM_REJECTED';

module.exports = function claim(payload) {
  console.info('claim it!');
  const text = payload.text;
  const device = payload.device;
  console.info(text, device);

  return parsePhone(text).then(phone => {
    console.info('phone parsed', phone);
    if (!phone) {
      throw handleError(REJECTED, 'Invalid phone number');
    }

    return getUsers(phone);
  }).then(users => {
    console.info('users back', users);

    if (users.length === 0) {
      throw handleError(REJECTED, `No users found for ${text}`);
    }
    return users.shift();
  }).then(user => {
    // kick off updateUser.
    return user;
  });
};
