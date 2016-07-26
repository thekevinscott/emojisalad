const CLAIM = 'CLAIM';

const PARSE_ERROR = 'PARSE_ERROR';
const claim = require('./users/claim');

const ROUTES = {
  [CLAIM]: claim,
};

export default function receiveMessage(message) {
  return new Promise((resolve, reject) => {
    try {
      const parsedMessage = JSON.parse(message);
      const type = parsedMessage.type;
      const FULFILLED = `${type}_FULFILLED`;
      const REJECTED = `${type}_REJECTED`;
      const payload = parsedMessage.payload;

      if (ROUTES[type]) {
        ROUTES[type](payload).then(data => {
          resolve({
            type: FULFILLED,
            data,
          });
        }).catch(data => {
          console.log('data back', data.message);
          reject({
            type: REJECTED,
            data: data.message,
          });
        });
      } else {
        reject({
          type: REJECTED,
          data: {
            message: `No route found for ${type}`,
          },
        });
      }
    } catch (err) {
      console.error('Invalid payload', message, err);
      reject({
        type: PARSE_ERROR,
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
}
