import Api from '../../utils/Api';

export default function websocketMiddleware({ dispatch, getState }) {
  return next => action => {
    //return next(action);
    const {
      payload,
      type,
      ...rest,
    } = action;

    console.log('2');
    if (!payload) {
      return next(action);
    }
    console.log('3');

    Api.sendMessage(type, payload);

    console.log('4');
    // continue on through the middleware stack
    return next({ ...rest, type });
  };
}
