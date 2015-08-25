var rp = require('request-promise');
var _ = require('lodash');
var sprintf = require('sprintf');
var User = require('../../models/user');
var Promise = require('bluebird');

var port = process.env.PORT || 5000;
var host = process.env.HOST || 'http://localhost';
/*
 * Request takes a scenario, a user, and 
 * a text message and will initiate an http request.
 */
function request(scenario, params) {
  var user = params.args[0].user;
  var message = params.args[0].pattern;
  // we make a dedicated promise, because request-promise uses its own non-Q promises
  if ( ! scenario ) {
    throw new Error("You must provide a scenario");
  } else if ( ! scenario.url ) {
    throw new Error("You must provide a URL");
  } else if ( user && ! user.id ) {
    throw new Error('You must provide a user with an id');
  }

  if ( !/^https?:\/\//i.test(scenario.url) ) {
    if ( !/^\//.test(scenario.url) ) {
      scenario.url = '/' + scenario.url;
    }
    scenario.url = host+':'+port+scenario.url;
  }

  //console.log('scenario url', scenario.url);
  //console.log('data', data);
  //console.log('user id', user.id);

  var url = sprintf(scenario.url, params);
  //var url = sprintf(scenario.url, {
    //user: user,
    //message: message
  //});
  //console.log('url', url);

  console.log('**** FIGURE THIS PART OUT****');
  if ( _.isFunction(scenario.data) ) {
    var data = scenario.data(user, message);
  } else {
    var data = scenario.data;
  }
  //console.log('json', data);

  return rp.call(this, {
    url: url,
    method: scenario.method || 'POST',
    json: data
  }).then(function(response) {
    if ( typeof(response) === 'string' ) {
      try {
        response = JSON.parse(response);
      } catch(e) {
        throw new Error({
          message: 'Invalid JSON returned',
          response: response
        });
      }
    }
    //if ( scenario.callback ) {
      //processScenarios(scenario.callback.scenarios, user, result, message);
    //}
    return response;
  });
}

module.exports = request;
