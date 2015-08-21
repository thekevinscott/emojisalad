var Promise = require('bluebird');
var request = Promise.promisify(require("request"));
var _ = require('lodash');

var host = 'http://localhost:'+process.env.PORT;

var params = {
  method: 'POST'
};

function req(options) {
  options = _.assign({}, params, options);

  options.url = host + options.url;
  return request(options).then(function(response) {
    var el = response.pop();
    try { 
      el = JSON.parse(el);
    } catch(e) {} // already json
    return el;
  });
}

function post(data) {
  return req({
    form: data
  });
}

function Req() {
  this.q = req;
  this.p = post;
  this.setParams = function(data) {
    params = _.assign({}, params, data);
  }
}

module.exports = new Req();
