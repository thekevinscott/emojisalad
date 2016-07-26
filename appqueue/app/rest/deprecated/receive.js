'use strict';
const Promise = require('bluebird');
const service = require('microservice-registry');
const request = Promise.promisify(require('request'));
Promise.promisifyAll(request);
const squel = require('squel').useFlavour('mysql');
const db = require('db');

module.exports = (message) => {
  console.info('queue receive', message);

  const bot = service.get('bot');
  //const sender_id = squel
  //.select()
  //.field('id')
  //.from('senders')
  //.where('sender=?',parsedData.to);

  /*
     return db.query(sender_id).then((sender) => {
     if ( sender && sender.length ) {
     return sender[0].id;
     } else {
     console.error('No sender was found', sender_id.toString(), parsedData, req.body);
     throw new Error(`No sender was found: ${sender_id.toString()} ${JSON.stringify(parsedData)} ${JSON.stringify(req.body)}`);
     }
     }).then((sender_id) => {
     */
  const query = squel
  .insert(
    { autoQuoteTableNames: true, autoQuoteFieldNames: true }
  )
  .into('received')
  .setFields({
    body: message.body,
    from: message.user_id,
    //to: sender_id,
    data: JSON.stringify(message),
    createdAt: squel.fval('NOW(3)'),
    //createdAt: squel.fval('NOW(3)')
  });

  return db.query(query).then((response) => {
    const message_id = response.insertId;
    if ( bot ) {
      const ping = bot.api.ping;
      // ping the bot here
      request({
        url: ping.endpoint,
        method: 'get'
      });
    }

    return {
      id: message_id
    };
  });
}
