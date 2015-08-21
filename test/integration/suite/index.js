var _ = require('lodash');
var r = require('./lib/req');

var suite = function(params) {
  require('./debug')(params);
  require('./signup')(params);
}
module.exports = suite;
