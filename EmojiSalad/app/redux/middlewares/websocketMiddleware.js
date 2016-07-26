import Api from '../../utils/Api';

export default function websocketMiddleware({ dispatch, getState }) {
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

    Api.sendMessage(type, payload);

    // continue on through the middleware stack
    return next({ ...rest, type });
  };
}
