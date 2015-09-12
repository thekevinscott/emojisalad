var _ = require('lodash');
var suite = function(params) {
  require('./signup');
  require('./invite');
  //require('./game')(params);
  //require('./game-three')(params);
  require('./guessing');
  require('./clues');
}
module.exports = suite;
