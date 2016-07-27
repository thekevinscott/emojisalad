import {
  fromApiToType,
} from './translate';

function parsePayload(e) {
  try {
    console.log('got a message back', e);
    const payload = JSON.parse(e.data);
    if (!payload.type) {
      console.log('no type for payload', Object.keys(payload));
    }
    return payload;
  } catch (err) {
    console.error('payload could not be parsed', e.data, err);
  }
}

export default function message(store) {
  return e => {
    const {
      type,
      data,
    } = parsePayload(e);

    const payload = {
      type: fromApiToType(type),
      data,
    };

    return store.dispatch(payload);
  };
}

