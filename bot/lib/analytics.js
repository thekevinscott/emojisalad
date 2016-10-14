const token = "95fd9ab140918c0f5e8bef7ba00680fb";
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
function track(user, text) {
  const requestOptions = {
    url: 'http://api.bonobo.ai/apiv1/addmessage/',
    method: 'post',
    form: {
      token,
      user_id: user.id,
      text,
      platform: user.protocol,
      who_speaks: 'user',
    }
  };
  return request(requestOptions);
}

module.exports = track;
