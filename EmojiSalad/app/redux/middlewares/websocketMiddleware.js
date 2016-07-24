export default function websocketMiddleware({ dispatch, getState }) {
  return next => action => {
    return next(action);
    /*
    const {
      socket,
      type,
      ...rest,
    } = action;

    if (!socket) {
      return next(action);
    }

    const PENDING = `${type}_PENDING`;
    const FULFILLED = `${type}_FULFILLED`;
    const REJECTED = `${type}_REJECTED`;

    // continue on through the middleware stack
    next({ ...rest, type: PENDING });

    return promise().then(response => {
      next({ ...rest, response, type: FULFILLED });
    }).catch(error => {
      next({ ...rest, error, type: REJECTED });
    });
    */
  };
}
