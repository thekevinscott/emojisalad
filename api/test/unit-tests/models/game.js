var Game = require('../../../models/game');

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

    describe('Valid emoji', function() {
      this.timeout(20000);
      // this is a list of phrases known to give trouble
      var troublePhrases = [
        //'⏳',
        //'⌛️',
        //'⏳⌛️',
        //'⏳⌛️🔙',
      ];
      var EmojiData = require('emoji-data');
      it('should check all emoji', function() {
        EmojiData.all().map(function(emoji) {
          var unified = EmojiData.unified_to_char(emoji.unified);
          Game.checkInput(unified).should.equal(true);
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

