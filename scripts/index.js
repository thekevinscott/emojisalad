var User = require('../models/user');
var rp = require('request-promise');
var _ = require('lodash');
var Q = require('q');

var script = require('./config');

var methods = {
  // send a text to the user
  respond: function respond(action, user, body) {
    console.log('respond', action.message, user.number);
    var message;
    if ( _.isFunction(action.message) ) {
      message = action.message(user, body);
    } else {
      message = action.message;
    }
    var options = [];
    if ( _.isFunction(action.options) ) {
      options = action.options(user, body);
    }
    return User.message(user, message, options);
  },
  // perform an http request
  request: function request(action, user, body) {
    console.log('request');
    if ( ! action.url ) {
      console.error('You must provide a URL');
      throw 'Bad URL';
    } else if ( typeof action.url === 'string' && action.url.substring(0,1) !== '/' ) {
      console.error('You must provide a properly formatted URL');
      throw 'Bad URL';
    }
    var url;
    if ( _.isFunction(action.url) ) {
      url = action.url(user, body);
    } else {
      url = action.url;
    }

    var data;
    if ( _.isFunction(action.data) ) {
      data = action.data(user, body);
    } else {
      data = action.data;
    }

    console.log('request', url);
    return rp({
      url: 'http://localhost:5000'+url,
      method: action.method || 'POST',
      json: data
    }).then(function(response) {
      console.log('action request response from API call', response);
    }).catch(function(err) {
      console.error('error making the request', err);
    });
  }
};

module.exports = function(user, body, res) {
  var dfd = Q.defer();
  console.log('the scripter');
  var message_key = user.state;
  console.log('message_key', message_key);
  if ( script[message_key] ) {
    var step = script[message_key];
    for ( var i=0, l=step.length; i<l; i++ ) {
      var branch = step[i];
      var regex;
      if ( branch.regex.flags ) {
        regex = RegExp(branch.regex.pattern, branch.regex.flags);
      } else {
        regex = RegExp(branch.regex.pattern);
      }
      if ( regex.test(body) ) {
        console.log('we match', regex);
        var promises = branch.actions.map(function(action) {
          if ( methods[action.type] ) {
            console.log('method exists', action.type);
            return methods[action.type](action, user, body);
          } else {
            throw "Action type does not exist: " + action.type;
          }
        });
        console.log('return set of promises');
        return Q.allSettled(promises).then(function() {
          console.log('all promises done');
        });
        break;
      }
    }
  }
  return dfd.promise;
};
