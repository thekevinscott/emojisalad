var req = require('./lib/req');
var Message = require('../../../models/Message');
var sprint = require('sprintf');
var Promise = require('bluebird');

module.exports = function(params) {
  var r = {
    q: function() {
      return req.q(null, params);
    },
    p: function(opts) {
      return req.p(opts, params );
    }
  }

  describe('Game', function() {
    var numbers = [];
    this.timeout(10000);
    beforeEach(function() {
      numbers = [
        '+1'+params.getUser(),
        '+1'+params.getUser(),
      ];
      return startGame(numbers).then(function(response) {
        console.log('response', response);
      });
    });
    it.only('should pick a random person to start off the game', function() {
    });
  });

  function signUp(number) {
    // set up a new user
    return req.p({
      username: number,
      message: 'hi'
    }, params).then(function() {
      return req.p({
        username: number,
        message: 'yes'
      }, params);
    }).then(function() {
      return req.p({
        username: number,
        message: number // the nickname
      }, params);
    });
  }

  function startGame(users) {
    return signUp(users[0]).then(function() {
      return req.p({
        username: users[0],
        message: 'invite '+users[1],
      }, params);
    }).then(function(response) {
      console.log('response', response);
      return req.p({
        username: users[1],
        message: 'yes'
      }, params);
    }).then(function(response) {
      console.log('response in', response);
      return req.p({
        username: users[1],
        message: users[1] 
      }, params, true);
    });
  }
}
