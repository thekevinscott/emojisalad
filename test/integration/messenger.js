var should = require('chai').should();


describe.only('Messenger', function() {
  require('./suite')({
    platform: 'messenger'
  });
});
