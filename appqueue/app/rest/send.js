const squel = require('squel').useFlavour('mysql');
import db from 'db';
import getUUID from '../../utils/getUUID';

import {
  translateUserKeyFromUserId,
  translateFromFieldIntoGameKey,
} from './lib/translate';

function getPromise() {
  return new Promise(resolve => resolve());
}

function getMessages(req) {
  try {
    //console.log('the original parsed', typeof req.body.messages, req.body.messages);
    const messages = JSON.parse(req.body.messages);
    //console.log('processed', typeof messages, messages);

    return messages;
  } catch (err) {
    console.error('Invalid messages payload', err, req.body);
    throw new Error(err);
  }
}

export default function send(req, res) {
  console.info('\n================queue send=================\n');
  console.info('queue send', req.body, req.query, req.params);

  if (! req.body.messages) {
    res.json({ error: 'You must provide messages' });
  }

  const messages = getMessages(req);
  console.info(`app queue send ${Buffer.byteLength(JSON.stringify(messages), 'utf9')} bytes`);

  //const senderIds = messages.map((message) => {
    //return message.from;
  //});

  /*
  const getSenderIds = squel
  .select()
  .field('id')
  .field('sender')
  .from('senders')
  .where('id IN ?', senderIds);

  return db.query(getSenderIds).then((rows) => {
    return rows.reduce((obj, row) => {
      obj[row.id] = row.sender;
      return obj;
    }, {});
  }).then((senders) => {
    // check that theres an id for each senderId
    senderIds.forEach((senderId) => {
      if (! senders[senderId]) {
        throw new Error(`No sender found for ${senderId}`);
      }
    });
    return senders;
  }).then((senders) => {
  */
  return messages.reduce((promise, message) => {
    const payload = {
      body: message.body,
      from: message.from,
      //to: message.to,
      initiated_id: message.initiated_id || '',
      created: squel.fval('NOW(3)'),
      key: getUUID(),
      user_key: translateUserKeyFromUserId(message.to),
      game_key: translateFromFieldIntoGameKey(message.from),
    };
    const insert = squel
    .insert({
      autoQuoteTableNames: true,
      autoQuoteFieldNames: true,
    })
    .into('sent')
    .setFields(payload);

    return promise.then(() => {
      return db.query(insert);
    });
  }, getPromise()).then(() => {
    console.log('*** also make sure to update status of message when sent');
    res.json({});
  });

    // THIS NEEDS TO HAPPEN LATER
    /*
       return Promise.reduce(processedMessages, (responses, data) => {
       const payload = Object.assign({}, data, {
from: data.sender,
});

return options.send(payload).then((response) => {
const updateMessage = squel
.update()
.table('sent')
.set('status', response.status)
.where('id=?', data.id);
return db.query(updateMessage);
}).then(() => {
return responses.concat(data);
});
}, []);
*/
  //}).then((responses) => {
  //res.json(responses);
}
