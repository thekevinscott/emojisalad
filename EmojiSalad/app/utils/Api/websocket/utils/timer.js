const TIMEOUT_LENGTH = 5000;
const timers = new Map();

export const setPendingAction = (type, action, dispatch) => {
  const {
    meta,
  } = JSON.parse(action);

  const metaId = meta.id;
  const fn = setTimeout(() => {
    const REJECTED = `${type}_REJECTED`;
    console.log('REJECTED SUCKA', type, metaId, REJECTED);
    timers.set(metaId, null);
    dispatch({
      meta,
      type: REJECTED,
      error: 'Network Timeout',
    });
  }, TIMEOUT_LENGTH);
  //console.log('set a new timeout', action);
  timers.set(metaId, fn);
};

export const clearPendingAction = (meta) => {
  if (meta) {
    const {
      id,
    } = meta;
    if (timers.get(id)) {
      //console.log('got a successful response, clear pending if exists', meta);
      clearTimeout(timers.get(id));
    }
  }
};
