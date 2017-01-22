import config from './config';

export default function promiseMiddleware({
  dispatch,
}) {
  return next => action => {
    const type = action.type;

    if (config[type]) {
      const PENDING = `${type}_PENDING`;
      const FULFILLED = `${type}_FULFILLED`;
      const REJECTED = `${type}_REJECTED`;

      fetch(config[type]).then(response => response.json()).then(payload => {
        dispatch({
          type: FULFILLED,
          payload,
        });
      }).catch(err => {
        dispatch({
          type: REJECTED,
          err,
        });
      });

      return next({
        ...action,
        type: PENDING,
      });
    }

    return next(action);
  };
}

