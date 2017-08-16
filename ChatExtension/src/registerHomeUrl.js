const fetch = require('./fetch');

const FB_API = 'https://graph.facebook.com/v2.6';


const registerHomeUrl = (token, homeUrl, rootUrl) => {
  const MESSENGER_PROFILE = `${FB_API}/me/messenger_profile?access_token=${token}`;
  const SUBSCRIBED_APPS = `${FB_API}/me/subscribed_apps?access_token=${token}`;
  // return fetch(SUBSCRIBED_APPS, {
  //   method: 'post',
  // }).then((resp) => {
  //   console.log('resp', resp);
  return fetch(MESSENGER_PROFILE, {
    method: 'post',
    body: {
      "whitelisted_domains":[
        rootUrl,
      ],
    },
  }).then(() => {
    const setHomeUrl = `${rootUrl}${homeUrl}`;
    return fetch(MESSENGER_PROFILE, {
      method: 'post',
      body: {
        "home_url" : {
          "url": setHomeUrl,
          "webview_height_ratio": "tall",
          "in_test": true,
        }
      },
    });
  // }).then((resp) => {
  //   console.log('registered', resp);
  }).catch(err => {
    console.error("Error registering", err);
  });
};

export default registerHomeUrl;
