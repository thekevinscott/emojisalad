import Api from '../../utils/Api';

export default function websocketMiddleware({ getState }) {
  return next => action => {
    //return next(action);
    const {
      payload,
      type,
      meta,
      ...rest,
    } = action;

    if (!payload) {
      return next(action);
    }

    const PENDING = `${type}_PENDING`;

    const userKey = getState().data.me.key;
    Api.sendMessage({
      userKey,
      type,
      payload,
      meta,
    });

    // continue on through the middleware stack
    return next({
      ...rest,
      type: PENDING,
      payload,
      meta,
    });
  };
}
