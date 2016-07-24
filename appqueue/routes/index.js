const CLAIM = 'CLAIM';

const claim = require('./claim');

const ROUTES = {
  [CLAIM]: claim,
};

module.exports = (message) => {
  return new Promise((resolve, reject) => {
    try {
      const parsedMessage = JSON.parse(message);
      const type = parsedMessage.type;
      const payload = parsedMessage.payload;

      if (ROUTES[type]) {
        ROUTES[type](payload).then(data => {
          resolve({
            type: `${type}_FULFILLED`,
            data,
          });
        }).catch(data => {
          console.log('data back', data.message);
          reject({
            type: `${type}_REJECTED`,
            data: data.message,
          });
        });
      } else {
        reject({
          type: `${type}_REJECTED`,
          data: {
            message: `No route found for ${type}`,
          },
        });
      }
    } catch (err) {
      console.error('Invalid payload', message, err);
      reject({
        type: 'PARSE_ERROR',
        data: {
          message: 'Invalid payload',
        },
      });
    }

    /*
       switch (payload.type) {
         case 'FETCH_MESSAGES':
           [
           'received',
           'sent',
           ].forEach(type => {
           getMessages(payload.userId, type).then(messages => {
           wsSend({
type: 'FETCH_MESSAGES_FULFILLED',
payload: messages,
});
});
});
break;
    default: break;
      }
      */
  });
};
