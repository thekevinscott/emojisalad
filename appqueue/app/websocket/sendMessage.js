const sendMessage = ws => payload => {
  return new Promise((resolve, reject) => {
    if (!payload.type) {
      reject(`You must provide a type: ${payload}`);
    } else if (!payload.data) {
      reject(`You must provide data ${payload}`);
    } else if (typeof payload.data === 'string') {
      reject(`data must not be a string ${payload}`);
    } else {
      const parsedPayload = JSON.stringify(payload);
      //console.log('parsed payload', parsedPayload);
      ws.send(parsedPayload);
      resolve(parsedPayload);
    }
  });
};

export default sendMessage;
