import Api from '../../utils/Api';

export default function websocketMiddleware({ getState }) {
  return next => action => {
    //return next(action);
    const {
      payload,
      type,
      ...rest,
    } = action;

    if (!payload) {
      return next(action);
    }

    const userKey = getState().data.me.key;
    Api.sendMessage(userKey, type, payload);

    // continue on through the middleware stack
    return next({ ...rest, type });
  };
}
