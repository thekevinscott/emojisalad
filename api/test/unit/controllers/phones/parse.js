const get = require('test/support/request').get;

describe('Parse', () => {
  it('should error an invalid phone number', () => {
    return get({
      url: '/phones/foo'
    }).then((res) => {
      //const body = res.body;
      //console.log('body', body.error);
      res.body.error.should.contain('Invalid phone number');
    });
  });

  it('should parse a valid phone number', () => {
    return get({
      url: '/phones/8604608183'
    }).then((res) => {
      res.body.should.have.property('phone', '+18604608183');
    });
  });

});

