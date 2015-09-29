'use strict';
const Game = require('../../../models/game');
const EmojiData = require('emoji-data');

describe('Game', function() {
  describe('Parsing emoji', function() {
    it('should allow a blank string', function() {
      Game.checkInput('').should.equal(true);
    });

    it('should reject text', function() {
      Game.checkInput('foo').should.equal(false);
    });

    it('should reject a mixed string', function() {
      Game.checkInput('😀foo😀').should.equal(false);
    });

    it('should reject a mixed string with emoji inside', function() {
      Game.checkInput('foo😀bar').should.equal(false);
    });

    it('should reject a mixed string with emoji at end', function() {
      Game.checkInput('foo😀').should.equal(false);
    });

    describe('Valid emoji', function() {
      this.timeout(20000);
      // this is a list of phrases known to give trouble
      var troublePhrases = [
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
      ];

      it('should check all emoji', function() {
        EmojiData.all().map(function(emoji) {
          var unified = EmojiData.unified_to_char(emoji.unified);
          //console.log('code point: ', unified, unified.codePointAt(0));
          try {
            Game.checkInput(unified).should.equal(true);
          } catch(e) {
            console.log('emoji failed:', unified);
            throw e;
          }
        });
      });

      troublePhrases.map(function(emoji) {
        it('should check phrase: '+emoji, function() {
          Game.checkInput(emoji).should.equal(true);
        });
      });
    });
  });

});

