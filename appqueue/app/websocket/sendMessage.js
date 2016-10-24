const sendMessage = (ws, startTime) => payload => {
  return new Promise((resolve, reject) => {
    if (!payload.type) {
      reject(`You must provide a type: ${payload}`);
    } else if (!payload.data) {
      reject(`You must provide data ${payload}`);
    } else if (typeof payload.data === 'string') {
      reject(`data must not be a string ${payload}`);
    } else {
      console.log('the payload: ', payload);
      if (startTime) {
        console.log('seconds elapsed', (startTime.getTime() - (new Date()).getTime()) / 1000);
      }
      const parsedPayload = JSON.stringify(payload);
      ws.emit('message', parsedPayload);
      resolve(parsedPayload);
    }
  });
};

export default sendMessage;
