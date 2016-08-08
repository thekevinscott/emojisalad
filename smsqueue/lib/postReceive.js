export default function(messageId, res) {
  //return res.json({
    //id: message_id
  //});
  const twiml = new twilio.TwimlResponse();
  res.send(twiml.toString());
}
