const sendMessage = ws => payload => {
  const parsedPayload = JSON.stringify(payload);
  console.log('parsed payload', parsedPayload);
  ws.send(parsedPayload);
};

export default sendMessage;
