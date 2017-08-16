'use strict';

var fetch = require('./fetch');

var root = 'https://graph.facebook.com/v2.6';
var ngrok = 'https://3318f959.ngrok.io';

var registerHomeUrl = function registerHomeUrl(token, homeUrl) {
  var url = root + '/me/messenger_profile?access_token=' + token;
  return fetch(url, {
    method: 'post',
    body: {
      "whitelisted_domains": [ngrok]
    }
  }).then(function () {
    var setHomeUrl = '' + ngrok + homeUrl;
    return fetch(url, {
      method: 'post',
      body: {
        "home_url": {
          "url": setHomeUrl,
          "webview_height_ratio": "tall",
          "in_test": true
        }
      }
    });
  });
};

module.exports = registerHomeUrl;