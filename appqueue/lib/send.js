'use strict';
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));

module.exports = (ws) => {
  console.log('send mount');
  return (req, res) => {
    console.log('send!');
    console.log('prams', req.body);
    return sendMessageToApp(params).then((response) => {
      console.log('response', response);
      return {
        status: 2
      };
    }).catch((err) => {
      console.error('err', err);
      return {
        status: 3
      };
    });
  };
};

function sendMessageToApp(params) {
  return new Promise(function(resolve) {
    resolve();
  });
  //return request({
    //url: 'https://graph.facebook.com/v2.6/me/messages',
    //qs: {
      //access_token: config.token
    //},
    //method: 'POST',
    //json: {
      //recipient: {
        //id: params.to
      //},
      //message: {
        //text: params.body
      //}
    //}
  //});
}
