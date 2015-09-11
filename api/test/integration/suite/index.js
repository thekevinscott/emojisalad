var _ = require('lodash');
var r = require('./lib/req');

var suite = function(params) {
  require('./signup')(params);
  require('./invite')(params);
  require('./game')(params);
  require('./game-three')(params);
  require('./guessing')(params);
  require('./clues');
}
module.exports = suite;
