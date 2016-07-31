const PARSE_ERROR = 'PARSE_ERROR';
import ROUTES from './routes';

function RouteException(type, message) {
  this.data = {
    message,
  };
  this.type = type;
}

function parseMessage(message) {
  return new Promise((resolve, reject) => {
    try {
      const parsedMessage = JSON.parse(message);
      const type = parsedMessage.type;
      const payload = parsedMessage.payload;
      resolve({
        type,
        payload,
      });
    } catch (err) {
      console.error('Invalid payload', message, err);
      reject({
        type: PARSE_ERROR,
        data: {
          message: 'Invalid payload',
        },
      });
    }
  });
}

function getTypes(type) {
  const FULFILLED = `${type}_FULFILLED`;
  const REJECTED = `${type}_REJECTED`;
  return {
    FULFILLED,
    REJECTED,
  };
}

function processRoute(ws, type, payload) {
  const {
    FULFILLED,
    REJECTED,
  } = getTypes(type);

  return ROUTES[type](ws, payload).then(data => {
    return {
      type: FULFILLED,
      data,
    };
  }).catch(data => {
    if (data.message || data.stack) {
      console.log('data back from rejection', data.message, data.stack);
      throw new RouteException(
        REJECTED,
        data.message,
      );
    } else {
      console.log('data back from rejection', data);
      throw new RouteException(
        REJECTED,
        'Unknown error',
      );
    }
  });
}

export default function receiveMessage(ws, message) {
  return parseMessage(message).then(({ type, payload }) => {
    const {
      REJECTED,
    } = getTypes(type);

    if (!ROUTES[type]) {
      throw new RouteException(
        REJECTED,
        `No route found for ${type}`
      );
    }

    return processRoute(ws, type, payload);

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
