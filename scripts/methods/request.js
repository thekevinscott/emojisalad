var rp = require('request-promise');
var _ = require('lodash');
var sprintf = require('sprintf');
var User = require('../../models/user');
var Promise = require('bluebird');

/*
 * Request takes a scenario, a user, and 
 * a text message and will initiate an http request.
 */
function request(scenario, user, message) {
  // we make a dedicated promise, because request-promise uses its own non-Q promises
  if ( ! scenario ) {
    throw new Error("You must provide a scenario");
  } else if ( ! scenario.url ) {
    throw new Error("You must provide a URL");
  } else if ( user && ! user.id ) {
    throw new Error('You must provide a user with an id');
  }

  if ( scenario.url.substring(0, 1) !== '/' ) {
    scenario.url = '/' + scenario.url;
  }

  var url = sprintf(scenario.url, {
    user: user,
    message: message
  });

  var data = scenario.data;

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
