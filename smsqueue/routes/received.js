'use strict';
const Promise = require('bluebird');
const Message = require('db').MessageReceived;

module.exports = Promise.coroutine(function* (req, res) {
  console.debug('\n================smsqueue received=================\n');

  const max_limit = 100;
  let limit = req.query.limit || max_limit;
  if ( limit > max_limit ) {
    limit = max_limit;
  }
  
  const offset = req.query.offset || 0;
  const date = req.query.date;

  const options = {
      attributes: [
        'body',
        'from',
        'to',
        'createdAt',
      ],
      limit: max_limit,
      offset: offset
  };

  if ( date ) {
    options.where = {
      createdAt: {
        //$lt: new Date(),
        $gte: date
      }
    }
  }
  
  let messages = yield Message.findAll(options);
  return res.json(messages);
});
