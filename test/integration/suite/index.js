var _ = require('lodash');
var r = require('./lib/req');

var suite = function(params) {
  params.url = '/platform/'+params.platform;
  delete params.platform;
  r.setParams(params);
  require('./debug');
  require('./signup');
}
module.exports = suite;
