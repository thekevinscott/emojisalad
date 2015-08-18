var User = require('../../models/user');
var rp = require('request-promise');
var _ = require('lodash');
var sprintf = require('sprintf');

console.log('rp', rp);

/*
 * Request takes a scenario, a user, and 
 * a text message and will initiate an http request.
 */
function request(scenario, user, message, origBody) {
  if ( ! scenario ) {
    throw new Error("You must provide a scenario");
  } else if ( ! scenario.url ) {
    throw new Error("You must provide a URL");
  } else if ( typeof scenario.url === 'string' && scenario.url.substring(0,1) !== '/' ) {
    throw new Error('You must provide a properly formatted URL');
  } else if ( user && ! user.id ) {
    throw new Error('You must provide a user with an id');
  }

  var url = sprintf(scenario.url, {
    user: user,
    message: message
  });

  var data;
  if ( _.isFunction(scenario.data) ) {
    data = scenario.data(user, message, origBody);
  } else {
    data = scenario.data;
  }

  console.log('request', url);
  console.log('rp', rp);
  return;
  return rp({
    url: 'http://localhost:5000'+url,
    method: scenario.method || 'POST',
    json: data
  }).then(function(response) {
    if ( typeof(response) === 'string' ) {
      response = JSON.parse(response);
    }
    console.log('what is response? an object?', typeof response);
    console.log('response from request', response);
    console.log('scenario', scenario, url, data);
    if ( scenario.callback ) {
      console.log('we have a callback', response);
      var result = scenario.callback.fn(response);
      console.log('result', result);
      processScenarios(scenario.callback.branches, result, user, message);
    } else {
      console.log('no callbck');
    }
    console.log('scenario request response from API call', response);
  }).catch(function(err) {
    console.error('error making the request', err);
  });
}

module.exports = request;
