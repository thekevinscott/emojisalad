import {
  fromApiToType,
} from '../translate';

import {
  dispatch,
} from '../utils/store';

function parsePayload(e) {
  try {
    const payload = JSON.parse(e.data);
    //console.log('got a message back', payload);
    if (!payload.type) {
      console.log('no type for payload', Object.keys(payload));
    }
    return payload;
  } catch (err) {
    console.error('payload could not be parsed', e.data, err);
  }
}

const onMessage = e => {
  const {
    type,
    data,
    meta,
  } = parsePayload(e);

  const payload = {
    type: fromApiToType(type),
    data,
    meta,
  };

  //console.log('the payload from onMessage', payload);

  return dispatch(payload);
};

export default onMessage;
