var User = require('../models/user');
var rp = require('request-promise');
var _ = require('lodash');
var Q = require('q');

var script = require('./config');

var methods = {
  // send a text to the user
  respond: function respond(action, user, body, origBody) {
    console.log('respond', action.message, user.number);
    var message;
    if ( _.isFunction(action.message) ) {
      message = action.message(user, body, origBody);
    } else {
      message = action.message;
    }
    var options = [];
    if ( _.isFunction(action.options) ) {
      options = action.options(user, body, origBody);
    }
    return User.message(user, message, options);
  },
  // perform an http request
  request: function request(action, user, body, origBody) {
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
      url = action.url(user, body, origBody);
    } else {
      url = action.url;
    }

    var data;
    if ( _.isFunction(action.data) ) {
      data = action.data(user, body, origBody);
    } else {
      data = action.data;
    }

    console.log('request', url);
    return rp({
      url: 'http://localhost:5000'+url,
      method: action.method || 'POST',
      json: data
    }).then(function(response) {
      if ( typeof(response) === 'string' ) {
        response = JSON.parse(response);
      }
      console.log('what is response? an object?', typeof response);
      console.log('response from request', response);
      console.log('action', action, url, data);
      if ( action.callback ) {
        console.log('we have a callback', response);
        var result = action.callback.fn(response);
        console.log('result', result);
        processActions(action.callback.branches, result, user, body);
      } else {
        console.log('no callbck');
      }
      console.log('action request response from API call', response);
    }).catch(function(err) {
      console.error('error making the request', err);
    });
  }
};

function processActions(branches, value, user, origBody) {
  // TODO: Make this better
  if ( ! origBody ) { origBody = value; }
  for ( var i=0, l=branches.length; i<l; i++ ) {
    var branch = branches[i];
    var regex;
    if ( branch.regex.flags ) {
      regex = RegExp(branch.regex.pattern, branch.regex.flags);
    } else {
      regex = RegExp(branch.regex.pattern);
    }
    if ( regex.test(value) ) {
      console.log('we match', regex, value);
      var promises = branch.actions.map(function(action) {
        if ( methods[action.type] ) {
          console.log('method exists', action.type);
          return methods[action.type](action, user, value, origBody);
        } else {
          throw "Action type does not exist: " + action.type;
        }
      });
      console.log('return set of promises');
      return Q.allSettled(promises).then(function() {
        console.log('all promises done');
      });
      break;
    } else {
      console.log('dont match', regex, value);
    }
  }
}

module.exports = function(user, body, res) {
  var dfd = Q.defer();
  console.log('the scripter');
  var message_key = user.state;
  console.log('message_key', message_key);
  if ( script[message_key] ) {
    var branches = script[message_key];
    processActions(branches, body, user);
  }
  dfd.resolve('huh');
  return dfd.promise;
};
