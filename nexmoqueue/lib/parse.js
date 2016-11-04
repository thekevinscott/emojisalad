/*
 * An incoming text from Nexmo contains the following:
 *
 *
 {
 "msisdn": "441632960960",
 "to": "441632960961",
 "messageId": "02000000E68951D8",
 "text": "Hello7",
 "type": "text",
 "keyword": "HELLO7",
 "message-timestamp": "2016-07-05 21:46:15"
 }
 */

module.exports = function parse(params) {
  //let incomingData = {
    //messageId: params.messageId,
    //from: params.msisdn,
    //text: params.text,
    //type: params.type,
    //timestamp: params['message-timestamp']
  //};

  return {
    body: params.text,
    to: params.to,
    from: params.msisdn,
    data: JSON.stringify(params)
  };
};
