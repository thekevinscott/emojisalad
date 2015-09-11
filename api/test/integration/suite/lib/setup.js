var Promise = require('bluebird');
var req = require('./req');

var setup = function(arr) {
  //arr.map(function(a) {
  //});

  var fns = arr.map(function(a, i) {
    var user = a.user;
    var msg = a.msg;
    return function() {
      return Promise.delay(500).then(function() {
        return req.post({
          user: user,
          message: msg
        });
      });
    }
  });
  return Promise.reduce(fns, function(response, fn) {
    return fn().then(function(output) {
      return response.concat(output);
    });
  }, []);

};

module.exports = setup;
