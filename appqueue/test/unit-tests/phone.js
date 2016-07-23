const phone = require('lib/phone');

describe('phone', () => {
  it('rejects a blank number', () => {
    return phone('').catch((err) => {
      err.message.should.equal('No number found');
    });
  });

  it('returns an error for a number thats too short', () => {
    return phone('8604608').catch((err) => {
      err.message.should.contain('Invalid Phone Number');
    });
  })

  it('returns an error for a number thats invalid', () => {
    return phone('+15555551234').catch((err) => {
      err.message.should.contain('Invalid Phone Number');
    });
  });

  it('parses a number without making a change', () => {
    return phone('+18604608183').then((result) => {
      result.should.equal('+18604608183');
    });
  });

  it('parses a number missing +1', () => {
    return phone('8604608183').then((result) => {
      result.should.equal('+18604608183');
    });
  });

  it('parses a number with parathenses', () => {
    return phone('(860) 460 8183').then((result) => {
      result.should.equal('+18604608183');
    });
  });

  it('parses a number with hyphens', () => {
    return phone('860-460-8183').then((result) => {
      result.should.equal('+18604608183');
    });
  });

  it('parses a number with dots', () => {
    return phone('860.460.8183').then((result) => {
      result.should.equal('+18604608183');
    });
  });
});
