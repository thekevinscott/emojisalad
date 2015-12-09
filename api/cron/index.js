'use strict';
const crontab = require('node-crontab');
const Message = require('models/message');
const Twilio = require('models/twilio');
const Promise = require('bluebird');

//const time = '00 * * * * *';
const time = '00 00 12 * * *';
const checkGames = require('./checkGames');
let job = Promise.coroutine(function* () {
  try {
  console.debug('The time is ', new Date());
  let game_responses = yield checkGames();
  console.debug('response', game_responses);
  return game_responses.map(function(response) {
    let messages = yield Message.parse(response)
    console.debug('messages', messages);
    return Twilio.send(messages);
  });
  } catch(err) {
    console.debug('error with cron job', err);
    console.error('error with cron job', err);
  }
});
crontab.scheduleJob(time, job);
