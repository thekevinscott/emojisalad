import ROUTES from './routes';

import RouteException from './RouteException';

function getTypes(type) {
  const FULFILLED = `${type}_FULFILLED`;
  const REJECTED = `${type}_REJECTED`;
  return {
    FULFILLED,
    REJECTED,
  };
}

function processRoute({
  ws,
  type,
  payload,
  meta,
  userKey,
}) {
  const {
    FULFILLED,
    REJECTED,
  } = getTypes(type);

  console.info('processing route', type, payload, meta, userKey);

  return ROUTES[type](ws, payload, userKey).then(data => {
    return {
      type: FULFILLED,
      meta,
      data,
    };
  }).catch(data => {
    if (data.message || data.stack) {
      console.error('route receiveMessage error with message: ', type, data.message, data.stack);
      throw new RouteException(
        REJECTED,
        data.message,
        meta,
      );
    } else {
      console.error('route receiveMessage error without message', data);
      throw new RouteException(
        REJECTED,
        'Unknown error',
      );
    }
  });
}

export default function receiveMessage(ws, {
  type,
  payload,
  meta,
  userKey,
}) {
  return new Promise((resolve, reject) => {
    console.info('received message', type, payload, meta, userKey);
    const {
      REJECTED,
    } = getTypes(type);

    if (!ROUTES[type]) {
      reject(new RouteException(
        REJECTED,
        `No route found for ${type}`
      ));
    }

    resolve(processRoute({
      ws,
      type,
      payload,
      meta,
      userKey,
    }));
  });
}
