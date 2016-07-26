import {
  toType,
} from './translate';

export default function message(store) {
  return e => {
    try {
      console.log('got a message back', e);
      const {
        type,
        data,
      } = JSON.parse(e.data);
      if (!type) {
        console.log('no type for payload', Object.keys(JSON.parse(e.data)));
      } else {
        store.dispatch({
          type: toType(type),
          data,
        });
      }
    } catch (err) {
      console.error('payload could not be parsed', e.data, err);
    }
  };
}

