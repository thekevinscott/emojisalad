'use strict';

const api = require('../service')('api');

const Email = {
  parse: (email) => {
    return api('email', 'parse', null, { email });
  }
};

module.exports = Email;
