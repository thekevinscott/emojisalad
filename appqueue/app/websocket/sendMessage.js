const sendMessage = (ws, startTime) => payload => {
  console.info('send message');
  return new Promise((resolve, reject) => {
    if (!payload.type) {
      reject(`You must provide a type: ${payload}`);
    } else if (!payload.data) {
      reject(`You must provide data ${payload}`);
    } else if (typeof payload.data === 'string') {
      reject(`data must not be a string ${payload}`);
    } else {
      console.info('the payload: ', payload);
      if (startTime) {
        console.info('seconds elapsed', ((new Date()).getTime() - startTime.getTime()) / 1000);
      }
      const parsedPayload = JSON.stringify({
        meta: {},
        ...payload,
      });
      ws.emit('message', parsedPayload);
      resolve(parsedPayload);
    }
  });
};

export default sendMessage;
