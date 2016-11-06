'use strict';
const _ = require('lodash');
const router = require('routes/web');
const Message = require('models/message');
const concatenate = require('lib/concatenateMessages');

module.exports = (entry) => {
  return router(entry.phone).then(responses => {
    if ( responses && _.isArray(responses) && responses.length ) {
      return Message.parse(responses, {});
    }
  });
};
