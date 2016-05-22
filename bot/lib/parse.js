// types
export const REQUEST = 'REQUEST';
export const MAP = 'MAP';
export const RESPOND = 'RESPOND';
export const BOOL = 'BOOL';

const Promise = require('bluebird');
const req = Promise.promisify(require('request'));
function request(options, payload) {
  if ( options.method === 'GET' ) {
    options.qs = payload;
  } else {
    options.form = payload;
  }
  return req(options).then((response) => {
    let body = response.body;
    try {
      body = JSON.parse(body);
    } catch(err) {}

    if ( body ) {
      return body;
    } else {
      throw new Error(`No response from service: ${JSON.stringify(options)}`);
    }
  });
};

export default function parse(actions, props) {
  return Promise.all(actions.map(({ params, type, callback }) => {
    switch(type) {
    case REQUEST:
      const {
        url,
        method,
        body
      } = params;

      return request({
        url,
        method
      }, body).then(response => {
        return parse(callback || [], response);
      });
      break;
    case MAP:
      const {
        iterator
      } = params;
      return Promise.all(iterator.map(i => parse(callback, i))).reduce((responses, response) => {
        return responses.concat(response);
      }, []);
      break;
    case RESPOND:
      const {
        message,
        player,
        meta
      } = params;

      let newPlayer;
      if (player === 'props') {
        newPlayer = props;
      } else if (typeof player === 'function') {
        newPlayer = player(props);
      } else {
        newPlayer = player;
      }

      return [{
        key: message.key,
        player: newPlayer,
        options: {
          ...props,
          ...message.options
        }
      }];
      break;
    case BOOL:
      const {
        resolve,
        reject
      } = params;
      let fn = params.fn;

      if (!fn) {
        const {
          regexp,
          flags,
          string
        } = params;
        fn = props => (new RegExp(regexp, flags)).test(string.trim());
      }

      if (fn(props)) {
        if (resolve) {
          return parse(resolve, props);
        }
      } else {
        if (reject) {
          return parse(reject, props);
        }
      }
      break;
    }
  })).filter(r => r).reduce((responses, response) => {
    return responses.concat(response);
  }, []);
}
