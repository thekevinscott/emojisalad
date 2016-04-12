'use strict';

const api = require('../service')('api');

const Phone = {
  parse: (phone) => {
    return api('phones', 'parse', null, { phone });
  }
};

module.exports = Phone;
