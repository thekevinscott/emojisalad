var _ = require('lodash');
var suite = function(params) {
  require('./signup');
  require('./invite');
  //require('./game')(params);
  //require('./game-three')(params);
  //require('./guessing')(params);
  require('./clues');
}
module.exports = suite;
