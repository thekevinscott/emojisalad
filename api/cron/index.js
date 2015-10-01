'use strict';
var crontab = require('node-crontab');

const time = '00 00 12 * * *';
const checkGames = require('./checkGames');
crontab.scheduleJob(time, function(){ //This will call this function every 2 minutes 
  console.log('The time is 12 o clock');
  checkGames();
});
