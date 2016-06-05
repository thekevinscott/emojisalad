const child_process = require('child_process');
function exec(cmd) {
  child_process.exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    //console.log(`stderr: ${stderr}`);
  });
}

module.exports = function(config) {
  console.log('subscribing to facebook page');
  exec(`curl -ik -X POST "https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=${config.token}"`);
};
