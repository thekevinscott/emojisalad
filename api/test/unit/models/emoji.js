'use strict';
const Emoji = require('models/emoji');
const EMOJI = '😄';
const NEW_EMOJI = '🌮';

describe('Emoji', () => {
  describe('getNumOfEmoji', () => {
    it('should return 0 emoji', () => {
      Emoji.getNumOfEmoji('').should.equal(0);
    });

    it('should return 0 emoji for a string', () => {
      Emoji.getNumOfEmoji('foo').should.equal(0);
    });

    it('should return 1 emoji for a single emoji', () => {
      Emoji.getNumOfEmoji(EMOJI).should.equal(1);
    });

    it('should return 2 emoji for 2 emojis', () => {
      Emoji.getNumOfEmoji(EMOJI + EMOJI).should.equal(2);
    });
  });

  describe.only('check', () => {
    it('should return text for an empty string', () => {
      return check('', { type: 'text' });
    });

    it('should return text for a text string', () => {
      return check('foo', { type: 'text' });
    });

    it('should return mixed for a mixed string with emoji at the front', () => {
      return check(`foo${EMOJI}`,{ type: 'mixed' });
    });

    it('should return mixed for a mixed string with emoji at the end', () => {
      return check(`${EMOJI}foo`,{ type: 'mixed' });
    });

    it('should return mixed for a mixed string with emoji in the middle', () => {
      return check(`bar${EMOJI}foo`,{ type: 'mixed' });
    });

    it('should return emoji for a single old emoji', () => {
      return check(`${EMOJI}`,{ type: 'emoji', number: 1 });
    });

    it('should return emoji for two old emoji', () => {
      return check(`${EMOJI}${EMOJI}`,{ type: 'emoji', number: 2 });
    });

    it('should return new_emoji for a single new emoji', () => {
      return check(`${NEW_EMOJI}`,{ type: 'emoji', number: 1 });
    });

    it('should return new_emoji for two new emoji', () => {
      return check(`${NEW_EMOJI}${NEW_EMOJI}`,{ type: 'emoji', number: 2 });
    });
  });
});

const check = (str, expected) => {
  return Emoji.check(str).then((resp) => {
    resp.should.deep.equal(expected);
  });
};
