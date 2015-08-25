var should = require('chai').should();
var _ = require('lodash');
describe('Messenger', function() {
  require('./suite')({
    url: '/platform/messenger',

    // TEST CALLBACKS

    // callback for a test that passes no data
    reject: function(response) {
      response.error.should.exist;
    },
    // callback to test for an empty response
    empty: function(response) {
      response.should.be.empty;
      //response.should.deep.equal([]);
    },

    getUser: function() {
      return getRand();
    },
    userKey: 'username',
    messageKey: 'message'

  });
});

function getRand() {
  return 'user' + Math.round(Math.random()*999999999999);
}
