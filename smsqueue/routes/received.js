'use strict';
const Promise = require('bluebird');
const Message = require('db').MessageReceived;
const moment = require('moment');
const sequelize = require('sequelize');

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
        [sequelize.fn('UNIX_TIMESTAMP', sequelize.col('createdAt')), 'timestamp']
      ],
      limit: max_limit,
      offset: offset
  };

  if ( date ) {
    options.where = {
      createdAt: {
        $gt: sequelize.fn('FROM_UNIXTIME', date)
      }
    }
  }
  
  const messages = yield Message.findAll(options);
  //.then(function(messages) {
    //return messages.map(function(message) {
      //const d = new Date(new Date());
      //console.log('created at', d.getTime()/1000);
      //d.getMilliseconds();
      //return {
        //body: message.body,
        //from: message.from,
        //to: message.to,
        //date: new Date(message.createdAt).getTime()
      //};
    //});
  //});
  return res.json(messages);
});
