const squel = require('squel').useFlavour('mysql');
import db from 'db';
import getUUID from '../../utils/getUUID';

import {
  translateIncomingMessage,
} from './lib/translate';

function getPromise() {
  return new Promise(resolve => resolve());
}

function getMessages(req) {
  try {
    const messages = JSON.parse(req.body.messages);
    return messages;
  } catch (err) {
    console.error('Invalid messages payload', err, req.body);
    throw new Error(err);
  }
}

function saveIncomingMessage(message, attempts = 0) {
  if (attempts > 5) {
    throw new Error(`too many attempts trying to generate random ID for an incoming message from bot: ${message.body}`);
  }
  const insert = squel
  .insert({
    autoQuoteTableNames: true,
    autoQuoteFieldNames: true,
  })
  .into('sent')
  .setFields({
    body: message.body,
    //from: message.from,
    //to: message.to,
    initiated_id: message.initiated_id,
    created: squel.fval('NOW(3)'),
    key: getUUID(),
    user_key: message.userKey,
    game_key: message.gameKey,
  });
  console.log(insert.toString());
  return db.query(insert).then(result => {
    if (!result.insertId) {
      return saveIncomingMessage(message, attempts + 1);
    }
  });
}

export default function send(req, res) {
  console.info('\n================queue send=================\n');
  console.info('queue send', req.body, req.query, req.params);

  if (! req.body.messages) {
    res.json({ error: 'You must provide messages' });
  }

  const messages = getMessages(req);
  //console.info(`app queue send ${Buffer.byteLength(JSON.stringify(messages), 'utf9')} bytes`);

  console.info('before promise');
  return Promise.all(messages.map(message => {
    console.info('each message');
    return translateIncomingMessage(message);
  })).then(translatedMessages => {
    return translatedMessages.reduce((promise, message) => {
      console.info('back from payloads');
      return promise.then(() => {
        console.log('payload', message);
        return saveIncomingMessage(message);
      });
    }, getPromise());
  }).then(() => {
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

