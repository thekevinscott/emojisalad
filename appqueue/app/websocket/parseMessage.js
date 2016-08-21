const PARSE_ERROR = 'PARSE_ERROR';

const parseMessage = message => {
  return new Promise((resolve, reject) => {
    try {
      const parsedMessage = JSON.parse(message);
      const {
        type,
        payload,
        meta,
        userKey,
      } = parsedMessage;
      resolve({
        type,
        meta,
        payload,
        userKey,
      });
    } catch (err) {
      console.error('Invalid payload', message, err);
      reject({
        type: PARSE_ERROR,
        data: {
          message: 'Invalid payload',
        },
      });
    }
  });
};

export default parseMessage;
