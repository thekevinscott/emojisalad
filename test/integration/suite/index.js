var Promise = require('bluebird');
var request = Promise.promisify(require("request"));
var suite = function(params) {
  it('should reject if no identifier is provided', function() {
    return request(params).then(function(response) {
      console.log('response', response.body);
    });
  });
}
module.exports = suite;
