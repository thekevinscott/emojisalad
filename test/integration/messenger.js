describe('Messenger', function() {
  console.log('messenger');
  require('./suite')({
    url: '/platform/messenger',

    // TEST CALLBACKS

    // callback for a test that passes no data
    reject: function(response) {
      response.error.should.exist;
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
