module.exports = function(messageId, res, params = {}) {
  let incomingData = {
    messageId: params.messageId,
    from: params.msisdn,
    text: params.text,
    type: params.type,
    timestamp: params['message-timestamp']
  };
  console.log('incomingData', incomingData);
  res.status(200).send(incomingData);
}
