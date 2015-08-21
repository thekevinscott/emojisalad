var r = require('./lib/req');

it('should call test', function() {
  return r.q({
    url: '/test',
    method: 'GET'
  }).then(function(response) {
    response.success.should.equal(1);
  });
});
