'use strict';
const crontab = require('node-crontab');
const Message = require('models/message');
const Twilio = require('models/twilio');

const time = '00 00 12 * * *';
const checkGames = require('./checkGames');
crontab.scheduleJob(time, function(){
  console.log('The time is 12 o clock');
  let response = checkGames();
  console.log('response', response);
  return Message.parse(response).then(function(messages) {
    //if ( process.env.ENVIRONMENT === 'test' ) {
       //this returns twiml
      //return Twilio.parse(messages);
    //} else {
      // this actually sends out sms
      return Twilio.send(messages);
    //}
  //}).then(function(twiml) {
    //return res.end(twiml.toString());
  });
});
