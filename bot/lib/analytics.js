const token = "95fd9ab140918c0f5e8bef7ba00680fb";
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));

function getOptions(user_id, text, platform, who_speaks) {
  return {
    url: 'http://api.bonobo.ai/apiv1/addmessage/',
    method: 'post',
    form: {
      token,
      user_id,
      text,
      platform,
      who_speaks,
    }
  };
}

function track(messages, who_speaks = 'user') {
  return Promise.all(messages.map(message => {
    return request(getOptions(
      message.player.key,
      message.body,
      message.player.protocol,
      who_speaks
    ));
  }));
}

module.exports = track;
