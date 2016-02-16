'use strict';
const Game = require('../../../models/game');
const EmojiData = require('emoji-data');

describe('Game', function() {
  describe('Parsing emoji', function() {
    it('should parse a blank string', function() {
      Game.checkInput('').should.equal('text');
    });

    it('should parse text', function() {
      Game.checkInput('foo').should.equal('text');
    });

    it('should parse a mixed string', function() {
      Game.checkInput('😀foo😀').should.equal('mixed-emoji');
    });

    it('should parse a mixed string with emoji inside', function() {
      Game.checkInput('foo😀bar').should.equal('mixed-emoji');
    });

    it('should reject a mixed string with emoji at end', function() {
      Game.checkInput('foo😀').should.equal('mixed-emoji');
    });

    describe('Valid emoji', function() {
      this.timeout(20000);
      // this is a list of phrases known to give trouble
      const troublePhrases = [
        '😀',
        '😀😀',
        '😀😀😀',
        '💩',

        // good hourglass
        '⌛',
        // bad hourglass,
        '⌛️',

        '⏳',
        '⏳⌛️',
        '⏳⌛️🔙',
        '⌛️',
        '🇨🇳',
        '🀄',

        '©',
        '®',
        '8️⃣',
        '🗣'
      ];

      it('should check all emoji', function() {
        EmojiData.all().map(function(emoji) {
          const unified = EmojiData.unified_to_char(emoji.unified);
          try {
            Game.checkInput(unified).should.equal('emoji');
          } catch(e) {
            throw e;
          }
        });
      });

      troublePhrases.map(function(emoji) {
        it('should check phrase: '+emoji, function() {
          Game.checkInput(emoji).should.equal('emoji');
        });
      });
    });
  });

});

