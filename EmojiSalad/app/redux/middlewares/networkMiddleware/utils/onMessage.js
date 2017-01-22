import {
  fromApiToType,
} from '../translate';

import { clearTimer } from './sendMessage';

const parsePayload = (e) => {
  try {
    const payload = JSON.parse(e);
    //console.log('got a message back', payload);
    if (!payload.type) {
      console.log('no type for payload', Object.keys(payload));
    }
    return payload;
  } catch (err) {
    console.error('payload could not be parsed', e.data, err);
  }
};

const onMessage = dispatch => e => {
  console.log('**** on message');
  const {
    type,
    data,
    meta,
  } = parsePayload(e);

  const parsedType = fromApiToType(type);

  const payload = {
    type: parsedType,
    data,
    meta,
  };

  console.log('payload', payload);

  if (meta && meta.id !== undefined) {
    clearTimer(meta.id);
  }

  return dispatch(payload);
};

export default onMessage;
