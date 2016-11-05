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

const jungleNumbers = [
  '12033496187',
];

import jungleParse from './jungleParse';

module.exports = function parse(params = {}) {
  //let incomingData = {
    //messageId: params.messageId,
    //from: params.msisdn,
    //text: params.text,
    //type: params.type,
    //timestamp: params['message-timestamp']
  //};

  if (params.messageId) {
    if (jungleNumbers.indexOf(params.to) !== -1) {
      console.log('handle the jungle');
      jungleParse(params);
      return {};
    }

    const newParams = {
      body: params.text,
      to: params.to,
      from: `+${params.msisdn}`,
      data: JSON.stringify(params)
    };

    console.info('parsed params', newParams);
    return newParams;
  }

  console.info('no incoming params, maybe a test');
  return {};
};
