var User = require('../models/user');
var Message = require('../models/message');
var Game = require('../models/game');
var Text = require('../models/text');
var Phone = require('../models/phone');
var regex = require('../config/regex');
var rp = require('request-promise');
var _ = require('lodash');

var script = require('./config');

function processAction(action, user, body) {
  console.log('process action', body, action.type);
  switch(action.type) {
    // send the user a message
    case 'respond':
      console.log('respond', action.message, user.number);
      var options = [];
      if ( _.isFunction(action.options) ) {
        options = action.options(user, body);
      }
      User.message(user, action.message, options);
      break;
    case 'request':
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
      rp({
        url: 'http://localhost:5000'+url,
        method: action.method || 'POST',
        json: data
      }).then(function(response) {
        console.log('action request response from API call', response);
      }).fail(function(err) {
        console.error('error making the request', err);
      });

      break;
  }
}

module.exports = function(user, body, res) {
  var message_key = user.state;
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
        console.log('number of actions', branch.actions.length);
        branch.actions.map(function(action) {
          processAction(action, user, body);
        });
        break;
      }
    }
  }
};
