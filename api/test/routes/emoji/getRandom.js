const get = require('test/support/request').get;

const Emoji = require('models/emoji');
describe('Get Random', function() {
  it('should get a random emoji', () => {
    return get({
      url: '/emoji'
    }).then((res) => {
      res.statusCode.should.equal(200);
      res.body.should.have.property('emoji');
    });
  });
});
