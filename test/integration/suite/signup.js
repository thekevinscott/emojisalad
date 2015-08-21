var r = require('./lib/req');

function getRand() {
  return 'user' + Math.round(Math.random()*999999999999);
}

describe.only('Signup', function() {
  this.timeout(5000);
  it('should reject if no identifier is provided', function() {
    return r.q().then(function(response) {
      response.error.should.exist;
    });
  });

  describe('Test a brand new user', function() {
    it('should introduce itself when contacting for the first time', function() {
      return r.p({
        username: getRand(),
        message: 'hello?'
      }).then(function(response) {
        response.key.should.equal('intro');
      });
    });

    it.only('should start the onboarding with a "yes" response', function() {
      var username = getRand();
      return r.p({
        username: username,
        message: 'hi'
      }).then(function(response) {
        response.key.should.equal('intro');
        return r.p({
          username: username,
          message: 'yes'
        });
      }).then(function(response) {
        console.log(response);
        response.key.should.equal('intro2');
      });
    });
  });
});
