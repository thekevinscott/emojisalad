/*
 * An incoming text from Twilio contains the following:
 *
 * ToCountry: 'US',
 * ToState: 'CT',
 * SmsMessageSid: 'SMc96a588b2e08804bea6a8e721f2809dc',
 * NumMedia: '0',
 * ToCity: 'GALES FERRY',
 * FromZip: '06357',
 * SmsSid: 'SMc96a588b2e08804bea6a8e721f2809dc',
 * FromState: 'CT',
 * SmsStatus: 'received',
 * FromCity: 'NEW LONDON',
 * Body: 'yes',
 * FromCountry: 'US',
 * To: '+18603814348',
 * NumSegments: '1',
 * ToZip: '06382',
 * MessageSid: 'SMc96a588b2e08804bea6a8e721f2809dc',
 * AccountSid: 'ACf2076b907d44abdd8dc8d262ff941ee4',
 * From: '+18604608183',
 * ApiVersion: '2010-04-01'
 */

module.exports = function parse(params) {
  if ( !params.from && ! params.From) {
    console.error('Potentially malicious error, invalid params', params);
    throw new Error('Incorrect parameters provided');
  } else {
    return {
      body: params.body || params.Body,
      to: params.to || params.To,
      from: params.from || params.From,
      data: JSON.stringify(params)
    };
  }
};
