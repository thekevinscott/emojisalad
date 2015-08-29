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
function request(scenario, data) {
  var user = data.user;
  var message = data.inputs[0];
  // we make a dedicated promise, because request-promise uses its own non-Q promises
  if ( ! scenario ) {
    throw new Error("You must provide a scenario");
  } else if ( ! scenario.url ) {
    throw new Error("You must provide a URL");
  }

  if ( !/^https?:\/\//i.test(scenario.url) ) {
    if ( !/^\//.test(scenario.url) ) {
      scenario.url = '/' + scenario.url;
    }
    scenario.url = host+':'+port+scenario.url;
  }

  //console.log('data', data);
  //console.log('user id', user.id);

  var url = sprintf(scenario.url, data);
  //var url = sprintf(scenario.url, {
    //user: user,
    //message: message
  //});

  console.log('**** FIGURE THIS PART OUT****');
  if ( _.isFunction(scenario.data) ) {
    //console.log('tis a function', scenario);
    //console.log('function data', data);
    var data = scenario.data(user, message);
  } else {
    var data = scenario.data;
  }

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
    return response;
  });
}

module.exports = request;
