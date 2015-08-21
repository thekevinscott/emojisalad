var _ = require('lodash');

describe('Twilio', function() {
  console.log('twilio');
  require('./suite')({
    url: '/platform/twilio',
    
    // TEST CALLBACKS

    // callback for a test that passes no data
    reject: function(response) {
      response[0].should.contain('You must provide a phone');
    },

    getUser: function() {
      return '(860) 460-8183'
    },
    userKey: 'From',
    messageKey: 'Body'
  });
});
