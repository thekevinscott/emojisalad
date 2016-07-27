const sendMessage = ws => payload => {
  if (!payload.type) {
    console.error('You must provide a type', payload);
  } else if (!payload.data) {
    console.error('You must provide data', payload);
  } else if (typeof payload.data === 'string') {
    console.error('data must not be a string', payload);
  } else {
    const parsedPayload = JSON.stringify(payload);
    console.log('parsed payload', parsedPayload);
    ws.send(parsedPayload);
  }
};

export default sendMessage;
