const post = require('test/support/request').post;
const EMOJI = '⚽️';

const Emoji = require('models/emoji');
describe('Check', function() {
  it('should return text for a blank string', () => {
    return post({
      url: "/emoji/check/",
    }).then((res) => {
      res.statusCode.should.equal(200);
      res.body.should.have.property('type', 'text');
    });
  });

  it('should return text for a text string', () => {
    return post({
      url: "/emoji/check",
      data: { emoji: 'foo`' },
    }).then((res) => {
      res.statusCode.should.equal(200);
      res.body.should.have.property('type', 'text');
    });
  });

  it('should return mixed for a mixed string', () => {
    return post({
      url: "/emoji/check",
      data: { emoji: 'foo💩' },
    }).then((res) => {
      res.statusCode.should.equal(200);
      res.body.should.have.property('type', 'mixed');
    });
  });

  it('should return emoji for an emoji', () => {
    return post({
      url: "/emoji/check",
      data: { emoji: '💩' },
    }).then((res) => {
      res.statusCode.should.equal(200);
      res.body.should.have.property('type', 'emoji');
    });
  });

  it('should return the correct number of emojis', () => {
    return post({
      url: "/emoji/check",
      data: { emoji: '💩' },
    }).then((res) => {
      res.statusCode.should.equal(200);
      res.body.should.have.property('number', 1);
      return post({
        url: "/emoji/check",
        data: { emoji: '💩💩💩' },
      });
    }).then((res) => {
      res.statusCode.should.equal(200);
      res.body.should.have.property('number', 3);
    });
  });
});
