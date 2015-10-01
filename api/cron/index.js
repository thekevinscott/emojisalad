const CronJob = require('cron').CronJob;
const timeZone = 'America/New York';
const time = '00 00 12 * * *';

const job = new CronJob(time, function() {
  console.log('The time is 12 o clock');
}, function () {
  console.log('done executing cron task');
}, true, timeZone);
