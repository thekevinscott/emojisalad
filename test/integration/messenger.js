var should = require('chai').should();
var Promise = require('bluebird');
var request = Promise.promisify(require("request"));
var _ = require('lodash');

var host = 'http://localhost:5005';

describe('Messenger', function() {
  var params = {
    //url: host+'/platform/messenger',
    url: host+'/test',
    method: 'GET'
  }
  //require('./suite')({
  //});

  it.only('test should work', function() {
    return request({
      url: host+'/test',
      method: 'GET'
    }).then(function(response) {
      var resp = JSON.parse(response.pop());
      resp.success.should.equal(1);
    });
  });

  it('should reject if no identifier is provided', function() {
    return request(params).then(function(response) {
      console.log('response back', response);
      //response.pop().error.should.exist;
    });
  });

  //it('should reject if no identifier is provided', function() {
    //var data = _.assign({}, params, {
      //message: 'foo',
      //username: 'tester'
    //});
    //return request(data).then(function(response) {
    //});
  //});
});
