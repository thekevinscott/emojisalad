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
      const {
        type,
        payload,
        meta,
      } = parsedMessage;
      resolve({
        type,
        meta,
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

function processRoute(ws, type, payload, meta) {
  const {
    FULFILLED,
    REJECTED,
  } = getTypes(type);

  console.info('processing route', type, payload, meta);

  return ROUTES[type](ws, payload).then(data => {
    return {
      type: FULFILLED,
      meta,
      data,
    };
  }).catch(data => {
    if (data.message || data.stack) {
      console.log('data back from rejection', data.message, data.stack);
      throw new RouteException(
        REJECTED,
        meta,
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
  console.log('received message', message);
  return parseMessage(message).then(({ type, payload, meta }) => {
    console.log(type, payload, meta);
    const {
      REJECTED,
    } = getTypes(type);

    if (!ROUTES[type]) {
      throw new RouteException(
        REJECTED,
        `No route found for ${type}`
      );
    }

    return processRoute(ws, type, payload, meta);
  });
}
